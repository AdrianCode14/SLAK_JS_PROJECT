import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
    name: "navbar",
    initialState: {
        current: 0,
    },
    reducers: {
        setCurrent: (state, action) => {
            state.current = action.payload;
        },
    },
});

export const { setCurrent } = navbarSlice.actions;

export default navbarSlice.reducer;
