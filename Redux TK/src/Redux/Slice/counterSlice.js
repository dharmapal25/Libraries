// step - 2

import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name : "counter",
    initialState : {
        value : 1
    },

    // Like small stores
    reducers : {
        increment : (state) => {
            state.value += 1
        },

        decrement : (state) => {
            state -= 1
        }

    }
})


export const {increment,decrement} = counterSlice.actions
export default counterSlice.reducer