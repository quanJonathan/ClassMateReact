import { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", localStorage.getItem("user"));
  const [token, setToken] = useLocalStorage(
    "token",
    localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is expired or not present
    //console.log(JSON.stringify(token));
    //console.log(user);
    const isTokenValid = (token1) => {
      let decodedAccessToken = '';
      if (!token1) {
        return false;
      }
      try {
        if(token1.accessToken){
           decodedAccessToken = JSON.parse(atob(token1.accessToken.split(".")[1]));
           if(decodedAccessToken.exp * 1000 > Date.now()){
              token1.accessToken = ''
           }
        }
        const decodeRefreshToken = JSON.parse(
          atob(token1.refreshToken.split(".")[1])
        );

        return decodeRefreshToken.exp * 1000 > Date.now();
      } catch (error) {
        console.error("Error decoding token:", error);
        return false;
      }
    };

    const fetchData = async () => {
      console.log(token)
      try {
        const { data } = await axios.get("https://classmatebe.onrender.com/auth/profile", {
          headers: {
            Authorization: "Bearer " + token.refreshToken,
          },
        });
        console.log("update \n" + Object.values(data));
        if (data) {
          setUser(data);
          // navigate(0);
        }
      } catch (exception) {
        console.log(exception);
      }
    };

    if (user) {
      if (!isTokenValid(token)) {
        setToken(null);
        setUser(null);
        navigate("/", {replace: true});
      }
    } else {
      if (isTokenValid(token)) {
        console.log("fetch data");
        fetchData();
      }
    }
  }, [navigate, setToken, setUser, token, user]);

  const login = async (form) => {
    try {
      const response = await axios.post(
        "https://classmatebe.onrender.com/auth/signIn",
        form
      );
      const token = response.data;
      console.log(response)
      console.log(Object.values(token));
      if (token) {
        setToken(token);
        localStorage.setItem("token", JSON.stringify(token));
        toast.success("Successfully Login");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Login Failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login Failed");
    }
  };

  const loginWithGoogle = async () => {
    try {
      window.open(
        `http://classmatebe/auth/google/${from.replaceAll("/", "@")}`,
        "_self"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const readFromStorage = async () => {
    setUser(localStorage.getItem("user"));
  };

  const updateUser = async (data) => {
    setUser(JSON.stringify(data));
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.setItem("token", null);
    localStorage.removeItem("user", null);
    navigate("/");
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = useMemo(
    () => ({
      token,
      setToken,
      user,
      login,
      logout,
      updateUser,
      isAuthenticated,
      loginWithGoogle,
      readFromStorage,
    }),
    [token, setToken, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
