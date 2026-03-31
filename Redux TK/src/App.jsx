// Step - 5

import React from 'react'
import "./App.css"
import { useDispatch, useSelector } from 'react-redux'
import { increase } from './App/Features/CounterSlice'
import { changeTheme } from './App/Features/ThemeSlice'


const App = () => {

  let num = useSelector((state) => state.counter.value)
  let theme = useSelector((state) => state.theme)
  let dispatch = useDispatch();


  return (

    <div className={(theme) === "light" ? "light" : "dark"} >
      <h1> {num} | {theme} </h1>
      <button
        onClick={() => {
          dispatch(increase());
          dispatch(changeTheme());
        }}
      >Increase</button>



      <h1>App page</h1>
    </div>
  )
}

export default App