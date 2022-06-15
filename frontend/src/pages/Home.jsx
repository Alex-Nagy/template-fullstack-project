import React from "react";
import { useCounter } from "../hooks/useCounter";
import { useCounter as useGlobalCounter } from "../providers/counter";
import { useAuth } from "../providers/auth";

const Home = () => {
  const { counter, increment, decrement } = useCounter("Home");
  const { value, increment: goUp, decrement: goDown } = useGlobalCounter();
  const { auth, token } = useAuth();

  return (
    <>
      <div>Home</div>
      <p>{token ? "Logged in" : "Anonymous"}</p>

      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <p>Value: {counter}</p>

      <button onClick={goDown}>-</button>
      <button onClick={goUp}>+</button>
      <p>Value: {value}</p>

      <button onClick={auth}>Login with Google</button>
    </>
  );
};

export default Home;
