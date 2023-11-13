import { useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import WebAppBar from "./AppBar";
import { useEffect } from "react";

export const ProtectedLayout = () => {
  const { token } = useAuth();
  const outlet = useOutlet();
  const navigate = useNavigate();

  // console.log("token in protected " + token);
  useEffect(() => {
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  });

  return (
    <div>
      {outlet}
    </div>
  );
};
