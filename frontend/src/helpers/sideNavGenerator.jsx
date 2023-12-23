import {
  ArrowDropDown,
  ArrowDropUp,
  Home,
  KeyboardArrowDown,
  KeyboardArrowUp,
  School
} from "@mui/icons-material";
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded';
import { useAuth } from "../hook/useAuth";

export function useSideNavGenerator() {
  const {user} = useAuth()
  const classes = user?.classes

 // console.log("classes" + user)


  const teaching = classes?.filter((classObject) => classObject.role === "3000");
  const attended = classes?.filter((classObject) => classObject.role === "1000");

  const sideNav = [
    {
      title: "Home",
      icon: <Home/>,
      path: "/dashboard",
    },
    {
      title: "Teaching",
      path: "",
      icon: <SupervisedUserCircleRoundedIcon />,
      iconClosed: (
        <ArrowDropUp
          sx={{ display: "flex", alignItems: "center" }}
        />
      ),
      iconOpened: (
        <ArrowDropDown
          sx={{ display: "flex", alignItems: "center" }}
        />
      ),
    },
    {
      title: "Attended",
      path: "",
      icon: <School />,
      iconClosed: (
        <ArrowDropUp
          sx={{ display: "flex", alignItems: "center" }}
        />
      ),
      iconOpened: (
        <ArrowDropDown
          sx={{ display: "flex", alignItems: "center" }}
        />
      ),
    }
  ];

  let teachingData = [];

  teaching?.forEach((t) => {
    // console.log(t)
    const tObject = {
      title: t.classId.className,
      path: `/c/${t.classId._id}`,
    };
    teachingData.push(tObject);
  });

  let attendedData = [];

  attended?.forEach((a) => {
    const aObject = {
      title: a.classId.className,
      path: `/c/${a.classId._id}`,
    };
    attendedData.push(aObject);
  });

  sideNav[1] = { ...sideNav[1], subNav: teachingData };
  sideNav[2] = { ...sideNav[2], subNav: attendedData };

  // console.log(sideNav)
  return sideNav
}
