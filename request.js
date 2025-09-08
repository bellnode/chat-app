import { NEW_REQUEST, REFRESH_CHATLIST} from "../constants/event.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

const sendRequest = async (req, res, next) => {
  const { receiverId } = req.body;
  if (!receiverId) {
    return next(new ErrorHandler("Plz send receiver id", 400));
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return next(new ErrorHandler("Receiver not found", 400));
  }

  const requestAlready = await Request.findOne({
    $or: [
      { sender: req.user, receiver: receiverId, status: "pending" },
      { sender: receiverId, receiver: req.user, status: "pending" },
    ],
  });

  if (requestAlready) {
    return next(new ErrorHandler("Request already pending", 400));
  }

  const ourChat = await Chat.find({
    groupChat: false,
    members: { $all: [req.user, receiverId] },
  });
  if (ourChat.length > 0) {
    return next(new ErrorHandler("Cannot send request to Friends", 400));
  }

  const request = await Request.create({
    sender: req.user,
    receiver: receiverId,
  });

  await request.populate('receiver', 'username');

  emitEvent(req, NEW_REQUEST, [receiver]);

  res.status(200).json({ success: true, request, receiverUsername: receiver.username });
};

const acceptRequest = async (req, res, next) => {
  const { requestId, accept } = req.body;
  if (!requestId) {
    return next(new ErrorHandler("Plz send request id", 400));
  }

  const request = await Request.findById(requestId)
    .populate("sender", "username")
    .populate("receiver", "username");
  if (!request) {
    return next(new ErrorHandler("Request not found", 400));
  }
  if (request.status !== "pending") {
    console.log("Not pending");
    return next(new ErrorHandler("Request already fulfilled", 400));
  }

  if (request.receiver._id.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not authorized", 400));
  }

  const members = [request.sender._id, request.receiver._id];

  if (accept) {
    request.status = "accepted";
    await Chat.create({
      members: members,
      name: `${request.sender.username}-${request.receiver.username}`,
    })
    emitEvent(req, REFRESH_CHATLIST, [request.receiver,request.sender]);
  } else {
    request.status = "rejected";
  }

  await request.save();

  emitEvent(req, "REFETCH_CHATS", members);

  res.status(200).json({
    success: true,
    Message: "Request status updated",
    status: request.status,
    senderUsername: request.sender.username
  });
};

const getNotifications = async (req, res, next) => {
  const request = await Request.find({
    receiver: req.user,
    status: "pending",
  }).populate("sender");

  const allRequest = request.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      username: sender.username,
      avatar: sender.avatar.url,
    },
  }));

  res.status(200).json({ success: true, allRequest });
};

export { sendRequest, acceptRequest, getNotifications };
