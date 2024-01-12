import { useOutlet } from "react-router-dom";
import { AuthProvider } from "../hook/useAuth.jsx";


export const AuthLayout = () => {
  const outlet = useOutlet();
 
  return <AuthProvider>{outlet}</AuthProvider>;
};
