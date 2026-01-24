import { createSlice } from "@reduxjs/toolkit";

const loanSlice= createSlice({
    name:"loan",
    initialState:{
        allLoans:[],
    },
    reducers:{
        //actions
        setAllLoans:(state,action)=>{
            state.allLoans=action.payload;
        }
    }
});
export const {setAllLoans}=loanSlice.actions;
export default loanSlice.reducer;