import React from "react";
import { useCounter } from "../hooks/useCounter";
import { useCounter as useGlobalCounter } from "../providers/counter";
import { useAuth } from "../providers/auth";

const Profile = () => {
  const { counter, increment, decrement } = useCounter("Profile");
  const { value, increment: goUp, decrement: goDown } = useGlobalCounter();
  const {token} = useAuth()

  return (
    <>
      <div>Profile</div>
      <p>{token ? "Logged in" : "Anonymous"}</p>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <p>Value: {counter}</p>

      <button onClick={goDown}>-</button>
      <button onClick={goUp}>+</button>
      <p>Value: {value}</p>
    </>
  );
};

export default Profile;
