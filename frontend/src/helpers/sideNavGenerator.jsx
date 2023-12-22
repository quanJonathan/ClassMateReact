import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  School,
} from "@mui/icons-material";

export function sideNavGenerator({ classes }) {
  const teaching = classes.filter((classObject) => classObject.role === "3000");
  const attended = classes.filter((classObject) => classObject.role === "1000");

  const sideNav = [
    {
      title: "Home",
      path: "/dashboard",
    },
    {
      title: "Teaching",
      path: "",
      icon: <School />,
      iconClosed: (
        <KeyboardArrowDown
          sx={{ display: "flex", alignItems: "center", ml: 2 }}
        />
      ),
      iconOpened: (
        <KeyboardArrowUp
          sx={{ display: "flex", alignItems: "center", ml: 2 }}
        />
      ),
    },
    {
        title: "Teaching",
      path: "",
      icon: <School />,
      iconClosed: (
        <KeyboardArrowDown
          sx={{ display: "flex", alignItems: "center", ml: 2 }}
        />
      ),
      iconOpened: (
        <KeyboardArrowUp
          sx={{ display: "flex", alignItems: "center", ml: 2 }}
        />
      ),
    }
  ];

  let teachingData = [];

  teaching.forEach((t) => {
    const tObject = {
      title: "${t.name}",
      path: "/c/${t._id}",
    };
    teachingData.push(tObject);
  });

  let attendedData = [];

  attended.forEach((a) => {
    const aObject = {
      title: "${a.name}",
      path: "/c/${a._id}",
    };
    attendedData.push(aObject);
  });

  sideNav[1] = { ...sideNav[1], subNav: teachingData };
  sideNav[2] = { ...sideNav[2], subNav: attendedData };
}
