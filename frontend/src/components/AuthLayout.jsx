import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider, useAuth } from "../hook/useAuth.jsx";

import Spinner from '../components/spinner.jsx'

export const AuthLayout = () => {
  const outlet = useOutlet();
 
  return <AuthProvider>{outlet}</AuthProvider>;
};
