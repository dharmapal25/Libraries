// Step - 5

import React from 'react'
import "./App.css"
import { useDispatch, useSelector } from 'react-redux'
import { increment } from './Redux/Slice/counterSlice'

const App = () => {

  const num = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (

    <div>
      <h1> num : {num} </h1>
      <button onClick={() => { dispatch(increment()) }} >Increment</button>
      <button>Decrement</button>
      <h1>App page</h1>
    </div>
  )
}

export default App