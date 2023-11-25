import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Root from "./src/routes/root";
import SignIn from "./src/routes/sign-in";
import SignUp from "./src/routes/sign-up";
import Dashboard from "./src/routes/dashboard";
import { HomeLayout } from "./src/components/HomeLayout";
import { AuthLayout } from "./src/components/AuthLayout";
import { ProtectedLayout } from "./src/components/ProtectedLayout";
import ProfilePage from "./src/routes/profile";
import GoogleOAuthSuccessRedirect from "./src/components/GoogleOAuthSuccessRedirect";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path="/" element={<HomeLayout />}>
        <Route path="" element={<Root />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      <Route path="/google-oauth-success-redirect" >
        <Route
          path=":accessToken/:refreshToken/:from"
          element={<GoogleOAuthSuccessRedirect />}/>
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/user" element={<ProtectedLayout />}>
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Route>
  )
);
