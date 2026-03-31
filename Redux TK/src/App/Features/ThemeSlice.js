import { createSlice } from "@reduxjs/toolkit";

let themeSlice = createSlice({
    name: "theme",
    initialState: "light",

    reducers: {
        changeTheme: (state) => {
            state = state === "light" ? "dark" : "light"
            return state
        }
    }
})

export const { changeTheme } = themeSlice.actions
export default themeSlice.reducer