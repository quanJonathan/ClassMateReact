import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer
} from "react-router-dom";
import Root from "./src/routes/root";
import SignIn from "./src/routes/sign-in";
import SignUp from "./src/routes/sign-up";
import { HomeLayout } from "./src/components/HomeLayout";
import { AuthLayout } from "./src/components/AuthLayout";

const getUserData = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      const user = window.localStorage.getItem("user");
      resolve(user);
    }, 3000)
  );


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
      >
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Root />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>
    </Route>
  )
);
