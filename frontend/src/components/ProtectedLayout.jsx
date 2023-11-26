import { useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const ProtectedLayout = () => {
  const { token, user } = useAuth();
  const outlet = useOutlet();
  const navigate = useNavigate();

  // console.log("token in protected " + token);
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      console.log("expired!")
    }
    if (user && user.state !== 'activated') {
      toast.error("Please Check Verification Email!");
      navigate("/confirm-email/send",  { replace: true });
      console.log("unactivated")
    }
  });

  return (
    <div>
      {outlet}
    </div>
  );
};
