import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import WebAppBar from "./AppBar";

export const HomeLayout = () => {
  const { user, logout } = useAuth();
  const outlet = useOutlet();

  // const token = user && JSON.parse(localStorage.getItem("user"))["token"];
  // if (jwtDecode(token).exp < Date.now() / 1000) {
  //   logout();
  //   localStorage.clear();
  // }

  logout();

  if (user) {
    return <Navigate to="/" replace />;
  } else {
    logout();
  }

  return (
    <div>
      <WebAppBar/>
      {outlet}
    </div>
  );
};
