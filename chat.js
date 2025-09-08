import {
  NEW_ATTACHMENT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFRESH_CHATLIST,
} from "../constants/event.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { emitEvent } from "../utils/features.js";
import { getOtherMember } from "../utils/helper.js";
import { ErrorHandler } from "../utils/utility.js";

const createGroup = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    if (!name) {
      return next(new ErrorHandler("Group should have a name", 400));
    }

    if (members.length < 2) {
      return next(
        new ErrorHandler("Group should conatin at least 3 members", 400)
      );
    }

    const allMembers = [...members, req.user];
    const group = await Chat.create({
      name,
      groupChat: true,
      members: allMembers,
      creator: req.user,
    })
    const populatedGroup = await Chat.findById(group._id).populate("members");
    emitEvent(req, REFRESH_CHATLIST, populatedGroup.members);

    console.log({ group });
    return res
      .status(200)
      .json({ success: true, message: `Group ${name} created successfully` });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: error?.message });
  }
};

const getMyChats = async (req, res, next) => {
  try {
    const search = req.query.search || "";

    // Ensure req.user is provided
    if (!req.user) {
      throw new Error("User ID is missing in the request.");
    }

    const userId = req.user;

    // Fetch all chats the user is a part of
    const chats = await Chat.find({ members: userId }).populate(
      "members",
      "username avatar"
    );

    // Prepare a promise to fetch the latest message for each chat
    const chatWithLastMessages = await Promise.all(
      chats.map(async (chat) => {
        const latestMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest message
          .select("content attachments createdAt sender");
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          readBy: { $ne: userId }, // Messages not read by the current user
        });

        // Process members and other details as before
        const filteredMembers = chat.members.filter(
          (member) => member._id.toString() !== userId
        );
        const otherMember = getOtherMember(chat.members, userId);

        return {
          _id: chat._id,
          members: chat.members.map((member) => ({
            _id: member._id,
            name: member.username || "No Name",
          })),
          filteredMembers: filteredMembers.map((member) => ({
            _id: member._id,
            name: member.username || "No Name",
          })),
          groupChat: chat.groupChat,
          creator: chat.creator,
          avatar: chat.groupChat
            ? filteredMembers.slice(0, 3).map((member) => member.avatar || {})
            : otherMember
            ? otherMember.avatar || ""
            : "",
          name: chat.groupChat
            ? chat.name
            : otherMember
            ? otherMember.username || "No Name"
            : "Unknown User",
          lastMessage:
            latestMessage && (latestMessage.content || latestMessage.attachments.length > 0)
              ? latestMessage.content || latestMessage.attachments[0] // Return the first attachment if exists
              : "Start Conversation...",
          lastMessageCreatedAt: latestMessage ? latestMessage.createdAt : null,
          lastMessageSender: latestMessage ? latestMessage.sender : null,
          unreadCount,
        };
      })
    );

    // Sort chats based on the most recent message
    chatWithLastMessages.sort((a, b) => {
      if (a.lastMessageCreatedAt && b.lastMessageCreatedAt) {
        return new Date(b.lastMessageCreatedAt) - new Date(a.lastMessageCreatedAt);
      }
      if (!a.lastMessageCreatedAt) return 1;
      if (!b.lastMessageCreatedAt) return -1;
      return 0;
    });

    // Filter chats based on search term
    const filteredChats = chatWithLastMessages.filter(
      (chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase()) ||
        chat.members.some((member) =>
          member.name.toLowerCase().includes(search.toLowerCase())
        )
    );

    return res.status(200).json({ success: true, groupChats: filteredChats });
  } catch (error) {
    console.error("Error in getMyChats:", error.message); // Log the specific error message for debugging
    return res.status(400).json({ success: false, message: error.message });
  }
};


const getGroupChats = async (req, res, next) => {
  try {
    // Find all group chats where the current user is a member
    const chats = await Chat.find({
      members: req.user,
      groupChat: true,
    }).populate("members", "username avatar");
    const myChats = chats.map(({ _id, name, members, creator }) => {
      const filteredMembers = members.filter(
        (member) => member._id.toString() !== req.user.toString()
      );

      return {
        _id,
        members: filteredMembers.map((member) => {
          return { _id: member._id, name: member.username };
        }),
        creator,
        avatar: filteredMembers.slice(0, 3).map((member) => member.avatar), // Get first 3 avatars
        name,
      };
    });

    return res.status(200).json({ success: true, groupChats: myChats });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const addGroupMember = async (req, res, next) => {
  const { chatId, members } = req.body;
  const chat = await Chat.findById(chatId);
  if (!members || members.length < 1) {
    return next(new ErrorHandler(`No members provided`, 400));
  }
  if (!chat) {
    return next(new ErrorHandler(`No Chat with Id ${chatId} exists`, 400));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler(`Not a group chat`, 400));
  }
  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler(`Only admin can add members`, 403));
  }

  const newMembers = await Promise.all(members.map((i) => User.findById(i)));

  const membersToAdd = newMembers.filter(
    (member) => !chat.members.includes(member._id.toString())
  );

  if (membersToAdd.length === 0) {
    return next(new ErrorHandler(`All members are already in the group`, 400));
  }

  chat.members.push(...membersToAdd.map((i) => i._id));
  await chat.save();
  const allMembersName = membersToAdd.map((i) => i.username).join(",");

  emitEvent(
    req,
    "ALERT",
    chat.members,
    `${allMembersName} have been added to the group`
  );
  emitEvent(req, "REFRESH_CHATS", chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Members added to the group" });
};

const removeGroupMember = async (req, res, next) => {
  const { chatId, userId } = req.body;
  console.log({chatId,userId})
  const [chat, userToRemove] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId),
  ]);

  if (!chat) {
    return next(new ErrorHandler(`No Chat with Id ${chatId} exists`, 400));
  }
  if (!userToRemove) {
    return next(new ErrorHandler(`No user Fonud`, 400));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler(`Not a group chat`, 400));
  }
  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler(`Only admin can add members`, 403));
  }
  if (!chat.members.includes(userToRemove._id.toString())) {
    return next(new ErrorHandler(`User does not belong to the group`, 403));
  }
  if (chat.members.length <= 3) {
    return next(new ErrorHandler(`Group should have at least 3 members`, 403));
  }

  if(chat.creator.toString()===userId.toString()){
    return next(new ErrorHandler('Admin cannot be removed',403))
  }

  // Remove the user
  chat.members = chat.members.filter(
    (i) => i.toString() !== userToRemove._id.toString()
  );

  // Check the number of remaining members after removal
  if (chat.members.length < 3) {
    return next(new ErrorHandler(`Group should have at least 3 members`, 403));
  }

  await chat.save();

  // emitEvent(
  //   req,
  //   "ALERT",
  //   chat.members,
  //   `${userToRemove.username} has been removed from the group`
  // );
  // emitEvent(req, "REFRESH_CHATS", chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Member removed from the group", removedUser: userToRemove.username });
};

const deleteGroup = async (req, res, next) => {
  const { id } = req.params;
  const [chat, user] = await Promise.all([
    Chat.findById(id).populate('members'),
    User.findById(req.user),
  ]);

  if (!chat) {
    return next(new ErrorHandler(`No Chat with Id ${id} exists`, 400));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler(`Not a group chat`, 400));
  }

  if (chat.creator.toString() !== user._id.toString()) {
    return next(new ErrorHandler('Only admin can delete', 403));
  }

  // If the user is the creator, delete the group chat entirely
  await Chat.findByIdAndDelete(id);
  emitEvent(req, REFRESH_CHATLIST, chat.members);


  return res.status(200).json({ success: true, message: "Group has been deleted successfully" });
};


const leaveGroup = async (req, res, next) => {
  const { id } = req.params;
  const [chat, user] = await Promise.all([
    Chat.findById(id),
    User.findById(req.user),
  ]);

  if (!chat) {
    return next(new ErrorHandler(`No Chat with Id ${chatId} exists`, 400));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler(`Not a group chat`, 400));
  }
  if (!chat.members.includes(user._id)) {
    return next(new ErrorHandler(`User does not belong to the group`, 403));
  }
  if (chat.members.length <= 3) {
    return next(new ErrorHandler(`Group should have at least 3 members`, 403));
  }

  const remaimingMem = chat.members.filter(
    (i) => i._id.toString() !== user._id.toString()
  );

  if (chat.creator.toString() === user._id.toString()) {
    chat.creator = remaimingMem[0];
  }

  chat.members = remaimingMem;
  await chat.save();

  // emitEvent(req, "ALERT", chat.members, `${user.username} has left the group`);

  return res
    .status(200)
    .json({ success: true, message: "You have left the group" });
};

const sendAttachments = async (req, res, next) => {
  const { chatId } = req.body;
  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user),
  ]);

  if (!chat) {
    console.log({ chat });
    return next(new ErrorHandler(`No Chat with Id ${chatId} exists`, 400));
  }
  if (!chat.members.includes(user._id.toString())) {
    return next(new ErrorHandler(`User does not belong to the Chat`, 403));
  }

  const files = req.files || [];

  if (files.length < 1) {
    return next(new ErrorHandler("No files attached", 400));
  }

  const attachments = await uploadToCloudinary(files, "Tangy-attachments");

  const messageRealTime = {
    chat: chatId,
    sender: { name: user.username, avatar: user.avatar.url, _id: user._id },
    content: "",
    attachments,
  };
  const messageDB = {
    chat: chatId,
    sender: user._id,
    content: "",
    attachments,
  };
  const message = await Message.create(messageDB);
  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageRealTime,
    chatId,
  });
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({ success: true, message });
};

const getChatDetails = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  if (req.query.populate) {
    const chat = await Chat.findById(id).populate("members", "username avatar").lean();
    // chat.members = chat.members.map((i) => {
    //   return {
    //     _id: i._id,
    //     avatar: i.avatar
    //       ? i.avatar.url
    //       : "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg",
    //     username: i.username,
    //   };
    // });
    const filteredMembers = chat.members.filter(
      (member) => member._id.toString() !== userId
    );
    if(!chat.groupChat){
      let otherMember = getOtherMember(chat.members,userId)
      chat.name = otherMember.username
      chat.avatar = otherMember?.avatar
    }else{
      chat.avatar = filteredMembers.slice(0, 3).map((member) => member.avatar || {})
    }
    return res.status(200).json({ success: true, chat });
  } else {
    const chat = await Chat.findById(id);
    return res.status(200).json({ success: true, chat });
  }
};

const renameChat = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const chat = await Chat.findById(id);
  if (!chat) {
    return next(new ErrorHandler(`No Chat with Id ${id} exists`, 400));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler(`Not a group chat`, 400));
  }
  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler(`Only admin can rename`, 403));
  }
  chat.name = name;
  await chat.save();
  emitEvent(req, "REFRESH_CHATS", chat.members);

  return res.status(200).json({ success: true, chat });
};

const deleteChat = async (req, res, next) => {
  const { id } = req.params;

  const chat = await Chat.findById(id);
  if (!chat) {
    return next(new ErrorHandler(`No Chat with Id ${id} exists`, 400));
  }
  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler(`You are not allowed to delete the group`, 400)
    );
  }
  if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(
      new ErrorHandler(`You are not allowed to delete the chat`, 403)
    );
  }
  emitEvent(req, "REFRESH_CHATS", chat.members);

  return res.status(200).json({ success: true });
};

const getMyFriends = async (req, res, next) => {
  try {
    const { chatId } = req.query;

    const myChats = await Chat.find({
      groupChat: false,
      members: req.user,
    }).populate("members", "username avatar");
    const friends = myChats.map(({ members }) => {
      const otherMember = getOtherMember(members, req.user);
      return {
        _id: otherMember._id,
        username: otherMember.username,
        avatar: otherMember.avatar.url,
      };
    });

    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return next(new ErrorHandler("Chat not found", 400));
      }
      const avaiableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );
      res.status(200).json({ success: true, friends: avaiableFriends });
      return;
    }

    return res.status(200).json({ success: true, friends });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};

const getMyNonGroupFriends = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Invalid group ID format", 400));
    }

    // Find the group chat and its members
    const groupChat = await Chat.findById(id);
    if (!groupChat) {
      return next(new ErrorHandler("Group not found", 400));
    }

    // Retrieve non-group friends logic
    const myChats = await Chat.find({
      groupChat: false,
      members: req.user,
    }).populate("members", "username avatar");
    const friends = myChats.map(({ members }) => {
      const otherMember = getOtherMember(members, req.user);
      return {
        _id: otherMember._id,
        username: otherMember.username,
        avatar: otherMember.avatar.url,
      };
    });

    // Filter out friends who are in the group
    const nonGroupFriends = friends.filter(
      (friend) => !groupChat.members.includes(friend._id)
    );

    return res.status(200).json({ success: true, friends: nonGroupFriends });
  } catch (error) {
    // Debugging: Log the full error details
    console.error("Error:", error);

    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createGroup,
  getMyChats,
  getGroupChats,
  addGroupMember,
  removeGroupMember,
  renameChat,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  deleteChat,
  getMyFriends,
  getMyNonGroupFriends,
  deleteGroup
};
