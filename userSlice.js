import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null, // Initial state for the user
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user data
    setUser: (state, action) => {
      state.user = action.payload; // Update user data
    },
    // Action to clear user data (e.g., on logout)
    clearUser: (state) => {
      state.user = null; // Reset user data to null
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
