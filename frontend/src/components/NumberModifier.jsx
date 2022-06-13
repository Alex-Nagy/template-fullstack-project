import React from 'react'
import NumberPresenter from './NumberPresenter'
import { useCounter } from "../CounterProvider";

const NumberModifier = () => {
  const {dec, inc} = useCounter();

  return (
    <div>
        <button onClick={dec}>-</button>
        <button onClick={inc}>+</button>
        <NumberPresenter />
    </div>
  )
}

export default NumberModifier