import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./slice/navbar";

export default configureStore({
    reducer: {
        navbar: navbarReducer,
    },
});
