import { useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import WebAppBar from "./AppBar";
import { useEffect } from "react";

export const HomeLayout = () => {
  const outlet = useOutlet();

  return (
    <div>
      {outlet}
    </div>
  );
};
