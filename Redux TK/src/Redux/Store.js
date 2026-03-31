// step - 1
import { configureStore } from '@reduxjs/toolkit'
import  counterReducer  from './Slice/counterSlice';
export const store = configureStore({

    // step - 3
    reducer : {
        counter : counterReducer
    }
});

