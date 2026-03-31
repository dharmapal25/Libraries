import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: "counter",
    initialState: {
        value : 0
    },

    reducers: {
        increase: (state) => {
            state.value ++
        }
    }
})

export const { increase } = counterSlice.actions
export default counterSlice.reducer