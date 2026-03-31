import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./Features/CounterSlice"
import themeReducer from "./Features/ThemeSlice"
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        theme : themeReducer
    }
})