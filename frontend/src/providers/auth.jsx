import { useContext, createContext, useState, useEffect } from "react";
import http from "axios";
import jwt from "jwt-decode";
import { toDoApi } from "../api/toDoApi";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const { post } = toDoApi();

  const auth = () => {
    const googleBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const searchParams = new URLSearchParams();
    searchParams.append(
      "client_id",
      "423125049963-vnhlm59vvirdjsquu0efhqvq5u91orks.apps.googleusercontent.com"
    );
    searchParams.append("scope", "openid");
    searchParams.append("redirect_uri", "http://localhost:3000/callback");
    searchParams.append("response_type", "code");
    searchParams.append("prompt", "select_account"); // have to select account to log in

    const fullUrl = googleBaseUrl + "?" + searchParams.toString();
    window.open(fullUrl);
  };

  const login = async (code, provider) => {
    try {
      const res = await http.post("http://localhost:4000/api/user/login", {
        code: code,
        provider: provider,
      });
      setToken(res.data.sessionToken);
      localStorage.setItem("token", res.data.sessionToken);
      setUser(jwt(res.data.sessionToken));
    } catch (error) {
      setToken(null);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const register = async (username) => {
    const res = await post("/user/create", { username });
    if (res?.status === 200) {
      setToken(res.data.sessionToken);
      localStorage.setItem("token", res.data.sessionToken);
      setUser(jwt(res.data.sessionToken));
    }
  };

  const contextValue = { token, auth, logout, login, user, register };

  useEffect(() => {
    const tokenInStorage = localStorage.getItem("token");
    if (tokenInStorage) {
      setToken(tokenInStorage);
      setUser(jwt(tokenInStorage));
    }
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("add AuthProvider to root");
  return context;
};

export { AuthProvider, useAuth };
