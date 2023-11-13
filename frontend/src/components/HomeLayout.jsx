import { useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import WebAppBar from "./AppBar";
import { useEffect } from "react";

export const HomeLayout = () => {
  const outlet = useOutlet();
  const { token } = useAuth();
  const navigate = useNavigate();

  // console.log("token in home " + token);
  useEffect(() => {
    if (token) {
      navigate("/user/profile");
    }
  }, [token, navigate]);

  return (
    <div>
      {outlet}
    </div>
  );
};
