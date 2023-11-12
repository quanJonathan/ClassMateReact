import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider, useAuth } from "../hook/useAuth.jsx";

export const AuthLayout = () => {
  const outlet = useOutlet();

  return <AuthProvider>{outlet}</AuthProvider>;
};
