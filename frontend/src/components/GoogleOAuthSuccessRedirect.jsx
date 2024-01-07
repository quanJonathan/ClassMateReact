import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import axios from "axios";
import { join } from "lodash";

const GoogleOAuthSuccessRedirect = ({ props }) => {
  let { accessToken, refreshToken, from } = useParams();
  const { setToken, currentJoiningLink, user, joining } = useAuth();
  const navigate = useNavigate();
  //const dispatch = useAppDispatch()

  const array = currentJoiningLink?.split("/");
  console.log(array)

  console.log("accessToken" + accessToken);
  console.log("freshToken" + refreshToken);
  console.log("from" + from);

  useEffect(() => {
    if (accessToken && refreshToken) {
      //dispatch(setAuthTokens({ accessToken, refreshToken }))
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      setToken(token);
      localStorage.setItem("token", JSON.stringify(token));
      if (joining) {
        axios.post(`http://localhost:3001/class/joinClass/${array[3]}`, user, {
          headers: {
            Authorization: "Bearer " + token?.refreshToken,
          },
        });
      }
      navigate("/dashboard", { replace: true });
    }
  }, [accessToken, from, navigate, refreshToken, setToken]);

  return <div>Loading...</div>;
};

export default GoogleOAuthSuccessRedirect;
