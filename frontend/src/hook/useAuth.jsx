import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", localStorage.getItem("user"));
  const [token, setToken] = useLocalStorage("token", localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state?.from?.pathname === '/auth' ? '/' : location.state?.from?.pathname) || '/';

  useEffect(() => {
    // Check if the token is expired or not present
    //console.log(JSON.stringify(token));
    //console.log(user);
    const isTokenValid = (token1) => {
      if (!token1) {
        return false;
      }
      try {
        const decodedAccessToken = JSON.parse(atob(token1.accessToken.split(".")[1]));
        const decodeRefreshToken = JSON.parse(atob(token1.refreshToken.split(".")[1]))
        
        return decodedAccessToken.exp * 1000 > Date.now() && decodeRefreshToken.exp * 1000 > Date.now();
      } catch (error) {
        console.error("Error decoding token:", error);
        return false;
      }
    };

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:3001/auth/profile',
          {
            headers: {
              Authorization: "Bearer " + token.accessToken,
            },
          }
        );
        console.log("update \n" + Object.values(data));
        if(data){
          setUser(data)
          // navigate(0);
        }
      } catch (exception) {
        console.log(exception);
      }
    }
    
    if (!isTokenValid(token)) {
      setToken(null);
      setUser(null)
      //navigate("/");
    }
    if(!user || !token || user.refreshToken !== token.refreshToken){
      console.log("fetch data")
      fetchData();
    }
  }, [token]);

  const login = async (form) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/signIn",
        form
      );
      const token = response.data;
      if (token) {
        setToken(token);
        localStorage.setItem("token", JSON.stringify(token));
        if (user && user.status !== 'activated') {
          toast.error("Please Check Verification Email!");
          navigate("/confirm-email/send",  { replace: true });
          console.log("unactivated")
        }
        else {
          toast.success("Successfully Login");
          navigate("/dashboard", { replace: true });
        }
      } else {
        toast.error("Login Failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login Failed");
    }
  };

  const loginWithGoogle = async() =>{
    try{
      window.open(`http://classmatebe/auth/google/${from.replaceAll('/', '@')}`, "_self");
    }catch(error) {
      console.log(error)
    }
  }

  const loginWithFaceBook = async() =>{
  }

  const readFromStorage = async() => {
    setUser(localStorage.getItem('user'))
  }

  const updateUser = async (data) => {
    setUser(JSON.stringify(data));
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      updateUser,
      isAuthenticated,
      loginWithGoogle,
      loginWithFaceBook,
      readFromStorage
    }),
    [updateUser, logout, login]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
