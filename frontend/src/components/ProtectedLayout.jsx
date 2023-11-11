import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import  WebAppBar  from "./AppBar";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <WebAppBar pages={[{ label: "Profile", path: "profile" }]} />
      {outlet}
    </div>
  );
};
