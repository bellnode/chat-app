import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  group: [],
}

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setGroup: (state, action) => {
      state.group = action.payload;
    },
  },
})

export const { setGroup } = groupSlice.actions

export default groupSlice.reducer