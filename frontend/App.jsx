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
import ConfirmEmail from "./src/routes/confirm-email";
import ConfirmEmailRecieve from "./src/routes/confirm-email-recieve";

import ForgotPassword from "./src/routes/forgot-password";
import ResetPassword from "./src/routes/reset-password";
import FacebookOAuthSuccessRedirect from "./src/components/FacebookOAuthSuccessRedirect";
import MainPageCourse from "./src/routes/main-page-course";
import JoinClassVerify from "./src/routes/join-class-verify";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path="/" element={<HomeLayout />}>
        <Route path="" element={<Root />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/google-oauth-success-redirect">
        <Route
          path=":accessToken/:refreshToken"
          element={<GoogleOAuthSuccessRedirect />}
        />
      </Route>
      <Route path="/reset-password">
        <Route path=":token" element={<ResetPassword />} />
      </Route>
      <Route path="/facebook-oauth-success-redirect">
        <Route
          path=":accessToken/:refreshToken"
          element={<FacebookOAuthSuccessRedirect />}
        />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user">
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/c">
          <Route path=":id" element={<MainPageCourse />} />
        </Route>
      </Route>

      <Route path="/c">
        <Route path="join/:classId" element={<JoinClassVerify />} />
      </Route>
      <Route path="/confirm-email">
        <Route path="send/" element={<ConfirmEmail />} />
        <Route path="receive/:refreshToken" element={<ConfirmEmailRecieve />} />
      </Route>
    </Route>
  )
);
