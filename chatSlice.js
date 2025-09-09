import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newMessageAlert: [],
  chats: [],
  totalMessagesAlert: 0,
  isChatLoading: false,
  isNewMessageAlertLoading: false,
  fetched: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNewMessageAlert: (state, action) => {
      const index = state.newMessageAlert.findIndex(
        (item) => item.chatId === action.payload.chatId
      );
      if (index !== -1) {
        state.newMessageAlert[index].count += 1;
      } else {
        state.newMessageAlert.push({ chatId: action.payload.chatId, count: 1 });
      }
      state.totalMessagesAlert += 1;
    },
    addUnreadMessages: (state, action) => {

      action.payload.forEach(({ chatId, count }) => {
        const index = state.newMessageAlert.findIndex((item) => item.chatId === chatId);

        if (index !== -1) {
          // Update the unread count by replacing the previous count
          state.totalMessagesAlert += count - state.newMessageAlert[index].count;
          state.newMessageAlert[index].count = count;
        } else {
          state.newMessageAlert.push({ chatId, count });
          state.totalMessagesAlert += count;
        }
      });
    }
    ,
    removeMessageAlert: (state, action) => {
      const alertItem = state.newMessageAlert.find(
        (item) => item.chatId === action.payload
      );
      if (alertItem) {
        state.totalMessagesAlert -= alertItem.count;
        state.newMessageAlert = state.newMessageAlert.filter(
          (item) => item.chatId !== action.payload
        );
      }
    },
    setChats: (state, action) => {
      state.chats = action.payload;
      state.fetched = true;
    },
    setChatLoading: (state, action) => {
      state.isChatLoading = action.payload;
    },
    setNewMessageAlertLoading: (state, action) => {
      state.isNewMessageAlertLoading = action.payload;
    },
    setChatLastMessage: (state, action) => {
      const chat = state.chats.find((chat) => chat._id === action.payload.chatId)
      if (chat) {
        state.chats = state.chats.map((chat) => {
          if (chat._id === action.payload.chatId) {
            return {
              ...chat,
              lastMessage: action.payload.latestMessage,
              lastMessageCreatedAt: action.payload.latestMessageCreatedAt,
              lastMessageSender: action.payload.latestMessageSender
            };
          }
          return chat;
        })
      }
    },
    moveChatToTop: (state, action) => {
      const index = state.chats.findIndex(chat => chat._id === action.payload);
      if (index !== -1) {
        const [movedChat] = state.chats.splice(index, 1);
        state.chats.unshift(movedChat);
      }
    }
  },
});

export const {
  setNewMessageAlert,
  removeMessageAlert,
  setChats,
  setChatLoading,
  setNewMessageAlertLoading,
  setChatLastMessage,
  addUnreadMessages,
  moveChatToTop
} = chatSlice.actions;

export default chatSlice.reducer;
