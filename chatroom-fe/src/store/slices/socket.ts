import {SOCKET_STATUS} from '@/ws/constant';
import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socketStatus: SOCKET_STATUS.disconnect
  },
  reducers: {
    updateSocketStatus: (state, action) => {
      state.socketStatus = action.payload;
    },    
  },
});

// 相当于以前的actions
export const { updateSocketStatus } = socketSlice.actions;

// 相当于以前的reducers
export default socketSlice.reducer;
