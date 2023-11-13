import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer,
  Routes
} from "react-router-dom";
import Root from "./src/routes/root";
import SignIn from "./src/routes/sign-in";
import SignUp from "./src/routes/sign-up";
import Dashboard from "./src/routes/dashboard";
import { HomeLayout } from "./src/components/HomeLayout";
import { AuthLayout } from "./src/components/AuthLayout";
import { ProtectedLayout } from "./src/components/ProtectedLayout";
import ProfilePage from "./src/routes/profile";
import { useAuth } from "./src/hook/useAuth";


const AppRoutes = () => {
  const  isAuthenticated  = useAuth();

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<HomeLayout />}>
          <Route path="/" element={isAuthenticated ? <Dashboard/> : <Root />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        <Route path="/user" element={<ProtectedLayout />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<AppRoutes />} />
  )
);