import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  creator: '',
}

export const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    setCreator: (state, action) => {
      state.creator = action.payload;
    },
  },
})

export const { setCreator } = creatorSlice.actions

export default creatorSlice.reducer