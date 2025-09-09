import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _ids : []
}

export const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    addOnlineUser: (state, action) => {
        if (!state._ids.includes(action.payload)) {
            state._ids.push(action.payload);
        }
    },
    setOnlineUsers:(state,action)=>{
        state._ids = action.payload;
    },
    removeOnlineUser: (state, action) => {
        state._ids = state._ids.filter(id => id !== action.payload);
    },
    clearOnlineUsers: (state) => {
      state._ids = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { setOnlineUsers,addOnlineUser,removeOnlineUser,clearOnlineUsers } = onlineUsersSlice.actions

export default onlineUsersSlice.reducer
