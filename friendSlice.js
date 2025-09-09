import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notFriends:[]
}

export const friendSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersNotFriends: (state, action) => {
      state.notFriends = action.payload; 
    },
    removeUsersNotFriends: (state,action) => {
      state.notFriends = state.notFriends.filter((e)=>e._id !== action.payload)
    },
  },
})

export const { setUsersNotFriends,removeUsersNotFriends } = friendSlice.actions

export default friendSlice.reducer
