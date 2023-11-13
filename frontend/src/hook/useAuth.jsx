import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", localStorage.getItem("user"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is expired or not present
    const isTokenValid = (token1) => {
      if (!token1) {
        return false;
      }
      try {
        const decodedToken = JSON.parse(atob(token1.split(".")[1]));
        return decodedToken.exp * 1000 > Date.now();
      } catch (error) {
        console.error("Error decoding token:", error);
        return false;
      }
    };

    if (!isTokenValid(token)) {
      setToken(null);
      navigate('/')
    }
  }, [token]);

  const login = async (form) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/signIn",
        form
      );
      const { token, ...user } = response.data;
      //console.log(response.data)
      if (token){
      setToken(token);
      localStorage.setItem("token", token);
      setUser(user);
      localStorage.setItem("user", user);
       toast.success('Successfully Login');
       navigate("/dashboard", { replace: true });
      }
      else {
        toast.error('Login Failed');
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('Login Failed due to :' + error.message);
    }

    
  };

  const updateUser = async (data) => {
    setUser(JSON.stringify(data))
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/")
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    token,
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
