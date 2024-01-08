import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import axios from "axios";
import { useEffect } from "react";

const JoinClassVerify = () => {
  const { user, setJoining, setCurrentJoiningLink, token } = useAuth();
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.pathname);

const role = location.pathname.split('/')[2] === 't' ? 'teacher' : 'student'
  useEffect(() => {
    if (user === null) {
      setJoining(true);
      setCurrentJoiningLink( location.pathname);
      navigate("/sign-in", { replace: true });
    } else {
      setJoining(false);
      setCurrentJoiningLink(null);
      axios.post(role === 'teacher' ? `https://classmatebe-final.onrender.com/class/joinClassAsTeacher/${classId}` : `https://classmatebe-final.onrender.com/class/joinClass/${classId}`, user, {
        headers: {
          Authorization: "Bearer " + token?.refreshToken,
        },
      });
      navigate("/dashboard", { replace: true });
    }
  }, [user?._id, navigate, setJoining, setCurrentJoiningLink]);
};

export default JoinClassVerify;
