import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import loanSlice from "./loanSlice";
const store = configureStore({
    reducer: {
        auth: authSlice,
        loan:loanSlice
    }
});

export default store;
