import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import WebAppBar from "./AppBar";

export const HomeLayout = () => {
  const { user, logout} = useAuth();
  const outlet = useOutlet();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <WebAppBar/>
      {outlet}
    </div>
  );
};
