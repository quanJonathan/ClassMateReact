import { useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const ProtectedLayout = () => {
  const { token, user, joining, currentJoiningLink } = useAuth();
  const outlet = useOutlet();
  const navigate = useNavigate();

  // console.log("token in protected " + token);
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      console.log("expired!");
    }
    if (user && joining) {
      navigate(currentJoiningLink);
    } else {
      if (user?.state !== "activated") {
        // toast.error("Please Check Verification Email!");
        navigate("/confirm-email/send", { replace: true });
        // console.log("unactivated");
      }
    }
  }, [user?.state, joining, token?.refreshToken, navigate, currentJoiningLink]);

  return <div>{outlet}</div>;
};
