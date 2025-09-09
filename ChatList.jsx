import React, { memo, useState, useEffect, useContext } from "react";
import { Stack, Typography } from "@mui/material";
import ChatItem from "../shared/ChatItem";
import chatService from "../../service/chatService";
import Searchbar from "../shared/Searchbar";
import { useInputValidation } from "6pp";
import { useSelector, useDispatch } from "react-redux";
import { Frown, Plus } from "lucide-react";
import { AppContext } from "../../context/SideMenuStates";
import {
  ThreeDots,
} from "react-loader-spinner";
import { setChats, setChatLoading, addUnreadMessages} from "../../redux/Slice/chatSlice";

const ChatList = () => {
  const csearch = useInputValidation(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const { newMessageAlert,isChatLoading,chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const onlineUsers = useSelector((state) => state.onlineUsers._ids);
  const { openNewGroupMenu } = useContext(AppContext);

  const dispatch = useDispatch();
  const searchChats = async (searchTerm) => {
    dispatch(setChatLoading(true));
    const res = await chatService.getChats(searchTerm);
    dispatch(setChats(res.groupChats));
    dispatch(setChatLoading(false));
  };

  //  const getMyChats = async (searchTerm = "") => {
  //       console.log('chatlist---------------------got chats')
  //       dispatch(setChatLoading(true));
  //       const res = await chatService.getChats(searchTerm);
  //       dispatch(setChats(res.groupChats));
  //       const unreadMessages = res.groupChats.map((chat) => ({
  //         chatId: chat._id,
  //         count: chat.unreadCount || 0,  // Ensure count defaults to 0 if not provided
  //       }));
  //       dispatch(addUnreadMessages(unreadMessages))
  //       dispatch(setChatLoading(false));
  //   };

    // useEffect(()=>{
    //   getMyChats()
    // },[])

  useEffect(() => {
    if (csearch.value!==null) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeoutId = setTimeout(() => {
        searchChats(csearch.value);
      }, 1000);

      setSearchTimeout(timeoutId); // Save timeout ID to state

      // Cleanup function to clear timeout on unmount
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [csearch.value]);

  return (
    <>
      <div className="w-full h-full bg-white border-r border-gray-200">
        <div className="p-4 pb-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
            <button
              onClick={openNewGroupMenu}
              className="p-2 hover:bg-purple-50 rounded-full transition-colors"
            >
              <Plus className="text-purple-600" size={24} />
            </button>
          </div>
          <Searchbar search={csearch} placeholder={"Search a conversation"} />
        </div>

        {isChatLoading ? (
          <div className="h-96 flex flex-row items-center justify-center">
            <ThreeDots color={"#4F46E5"} width={100} />
          </div>
        ) : chats.length > 0 ? (
          <Stack
            width={"100%"}
            direction={"column"}
            style={{
              height: "calc(100% - 156px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {chats.map((data) => {
              const {
                _id,
                name,
                avatar,
                members,
                groupChat,
                lastMessage,
                lastMessageCreatedAt,
                lastMessageSender,
                filteredMembers,
              } = data;
              const alertForThisChat = newMessageAlert.find(
                (alert) => alert?.chatId?.toString() === _id?.toString()
              );
              let msgSenderName
              if(lastMessageSender){
                msgSenderName = members.find((m)=>m._id===lastMessageSender)
              }
              const isOnline = groupChat
                ? false
                : onlineUsers.includes(filteredMembers[0]._id);
          

              return (
                <ChatItem
                  key={_id}
                  _id={_id}
                  isOnline={isOnline}
                  groupChat={groupChat}
                  lastMessage={lastMessage}
                  lastMessageCreatedAt={lastMessageCreatedAt}
                  name={name || "Unnamed Chat"}
                  avatar={avatar}
                  newMessageAlert={alertForThisChat}
                  lastMessageSender={msgSenderName?._id === user?._id?'You':msgSenderName?.name}
                  members={members}
                />
              );
            })}
          </Stack>
        ) : (
          <div className="h-96 flex flex-row items-center justify-center">
            <Frown className="mr-4" size={18} />
            No Chat Found
          </div>
        )}
      </div>
    </>
  );
};

export default memo(ChatList);