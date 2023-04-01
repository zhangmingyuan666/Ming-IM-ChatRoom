// wrapper.ts
import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import {createWrapper} from 'next-redux-wrapper';
import userSlice from "@/store/slices/user";
import socketSlice from '@/store/slices/socket'

export function makeStore() {
    return configureStore({
        reducer: {
            user: userSlice,
            socket: socketSlice
        },
    });
}

export const wrapper = createWrapper(makeStore);
