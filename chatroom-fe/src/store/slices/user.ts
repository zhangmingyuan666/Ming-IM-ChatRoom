import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',

  initialState: {
    userInfo: {
        userId: process.browser ?localStorage.getItem('userId') : null,
        username: process.browser ?localStorage.getItem('username') : null
    },
    currentSelectUser: {
      userId: null,
      username: null
    },
    meetingInfo: {
      meetingId: null
    }
  },

  reducers: {
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },    
    updateCurrentSelectUser: (state, action) => {
      state.currentSelectUser = action.payload;
    },
    updateMeetingInfo: (state, action) => {
      state.meetingInfo = action.payload;
    },
  },
});

// 相当于以前的actions
export const { updateUserInfo, updateCurrentSelectUser, updateMeetingInfo } = counterSlice.actions;

// 相当于以前的reducers
export default counterSlice.reducer;
