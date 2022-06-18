import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../providers/auth";

const Navbar = () => {
  const { auth, token, logout } = useAuth();
  const navigate = useNavigate();

  const nav = (path) => {
    console.log("rerouting"); // barmi logika
    navigate(path);
  };

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: "gray",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <button onClick={() => nav("/")}>Home</button>
        <button onClick={() => nav("/about")}>About</button>
        <button onClick={() => nav("/profile")}>Profile</button>
        {/* <Link to="/profile"> Profile </Link> */}
      </div>
      <div>
        {!token ? (
          <button onClick={() => auth()}>Login</button>
        ) : (
          <button onClick={() => logout()}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
