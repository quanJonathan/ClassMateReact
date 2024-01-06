import { useState } from "react";
import {
  Box,
  styled,
  useTheme,
  Toolbar,
  List,
  CssBaseline,
  Divider,
  IconButton,
  Menu as MenuComponent,
  MenuItem,
  Container,
  Breadcrumbs,
  Avatar,
  useMediaQuery,
  Link,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import HomeContent from "./HomeContent";

import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  AccountCircle,
  Add,
  NavigateNext,
  Settings,
} from "@mui/icons-material";
import AppName from "./WebName";
import { useAuth } from "../hook/useAuth.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SubMenu from "./Submenu.jsx";
import { useSideNavGenerator } from "../helpers/sideNavGenerator";
import { Stack } from "@mui/system";
import CourseContent from "../components/CourseContent.jsx";
import OptionMenu from "./OptionMenu.jsx";
import FullScreenDialog from "./FullScreenDialog.jsx";
import { stringAvatar } from "../helpers/stringAvator";
import axios from "axios";
import AssignmentViewingDetails from "../routes/assignment-viewing-details.jsx";
import AssignmentViewingAll, {
  AssignmentViewingAllMain,
} from "../routes/assignment-viewing-all.jsx";
import AddPeopleDialog from "./AddPeopleDialog.jsx";
import CreateClassDialog from "./CreateClassDialog.jsx";
import { AssignmentViewingDetailsMain } from "../routes/assignment-viewing-details.jsx";
import { useIsTeacher } from "../helpers/getCurrentRole.jsx";
import SettingDialog from "./SettingDialog.jsx";

const drawerWidth = 350;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 20px)`,
  },
});

const Drawer = styled(
  MuiDrawer
  //   {
  //   shouldForwardProp: (prop) => prop !== "open",
  // }
)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + (true ? 1 : 0),
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // ...(open && {
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(["width", "margin"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function MiniDrawer({ children, page }) {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const { logout, isAuthenticated, user } = useAuth();
  // console.log(user);
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogAddOpen, setDialogAddOpen] = useState(false);
  const [isDialogJoinOpen, setDialogJoinOpen] = useState(false);

  const [isDialogOpen, setDialogOpen] = useState(false);

  const { id } = useParams();

  const isTeacher = useIsTeacher(id);

  const location = useLocation();
  // console.log(location)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.target);
    console.log(event.target);
  };

  const handleDrawerOpenClose = () => {
    setOpen(!open);
  };

  const openModal = () => {
    setDialogOpen(true);
  };

  const options = [
    {
      label: "Join class",
      action: () => handleJoinClassModal(),
    },
    {
      label: "Create class",
      action: () => handleOpenAddModal(),
    },
  ];

  const getGradeScaleLeft = () => {
    let finalValue = 100;
    children?.compositions.map((c) => {
      finalValue = finalValue - parseInt(c.gradeScale);
    });
    return finalValue == 0 ? 0 : finalValue;
  };

  const handleOpenAddModal = () => {
    setDialogAddOpen(true);
  };

  const handleJoinClassModal = () => {
    setDialogJoinOpen(true);
  };

  const SidebarData = useSideNavGenerator();

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (anchorEl) => (
    <MenuComponent
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => navigate("/user/profile")}>Profile</MenuItem>
      <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
      <MenuItem
        onClick={() => {
          logout();
          setAnchorEl(null);
        }}
        sx={{ color: "red" }}
      >
        Log out
      </MenuItem>
    </MenuComponent>
  );

  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <FullScreenDialog
        open={isDialogJoinOpen}
        handleClose={() => setDialogJoinOpen(false)}
      />
      <CreateClassDialog
        isOpen={isDialogAddOpen}
        handleClose={() => setDialogAddOpen(false)}
      />
      <SettingDialog
        open={isDialogOpen}
        handleClose={() => setDialogOpen(false)}
        compositions={children?.compositions}
        defaultValue={getGradeScaleLeft()}
      />
      <AppBar
        position={true ? "fixed" : "absolute"}
        elevation={0}
        open={open}
        sx={{
          height: "70px",
          bgcolor: "#FFF",
          color: "#2f2f2f",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              height: { xs: "12vh", md: "10vh" },
              justifyContent: "flex-start",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpenClose}
              edge="start"
              sx={{
                "@media screen and (max-width: 500px)": {
                  height: 20,
                  width: 20,
                },
              }}
            >
              <MenuIcon
                sx={{
                  "@media screen and (max-width: 500px)": {
                    height: 20,
                    width: 20,
                  },
                }}
              />
            </IconButton>

            <AppName children={children}/>

            {children && (
              <div
                role="presentation"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <NavigateNext
                  fontSize="large"
                  sx={{
                    mr: 1,
                    "@media screen and (max-width: 500px)": {
                      display: "none",
                    },
                  }}
                />
                <Breadcrumbs
                  separator={<NavigateNext />}
                  aria-label="breadcrumb"
                  sx={{ fontSize: "25px" }}
                >
                  <Link
                    underline="hover"
                    key="1"
                    color="inherit"
                    onClick={() => navigate(`/c/${children?._id}`)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "@media screen and (max-width: 500px)": {
                        fontSize: "15px",
                      },
                    }}
                  >
                    {children?.className}
                  </Link>
                </Breadcrumbs>
              </div>
            )}

            <Box
              sx={{
                alignItems: "center",
                justifyContent: "space-evenly",
                position: "absolute",
                right: 0,
                display: "flex",
              }}
            >
              {isAuthenticated() && (
                <>
                  {location.pathname === "/dashboard" && (
                    <OptionMenu
                      options={options}
                      actionIcon={<Add sx={{ width: 30, height: 30 }} />}
                    />
                  )}
                  <Avatar
                    {...stringAvatar(
                      user
                        ? `${user?.firstName} ${user?.lastName}`
                        : "Default Name",
                      {
                        ml: 2,
                        "@media screen and (max-width: 500px)": {
                          display: "none" ,
                          ml: 2,
                        },
                      }
                    )}
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                  >
                    {/* <AccountCircle sx={{ width: "40px", height: "40px" }} /> */}
                  </Avatar>
                </>
              )}
            </Box>

            {isTeacher && children && (
              <IconButton
                edge="end"
                sx={{
                  width: 30,
                  height: 30,
                  mt: 2,
                  display: "none",
                  "@media screen and (max-width: 500px)": {
                    display: "flex",
                    position: "absolute",
                    right: 0,
                    mt: 0,
                  },
                }}
                onClick={openModal}
                aria-label="settings"
                id="long-button"
              >
                <Settings sx={{ width: 30, height: 30 }} />
              </IconButton>
            )}
          </Toolbar>
        </Container>
        {renderMenu(anchorEl)}
      </AppBar>
      <Drawer
        variant={lgUp ? "permanent" : "temporary"}
        open={open}
        onClose={handleDrawerOpenClose}
      >
        <Toolbar />
        <DrawerHeader
          sx={{
            display: "none",
            "@media screen and (max-width: 500px)": {
              display: "flex",
              mt: 4,
            },
          }}
        >
          {isAuthenticated() && open && (
            <Avatar
              {...stringAvatar(
                user ? `${user?.firstName} ${user?.lastName}` : "Default Name",
                {
                  ml: 2,
                }
              )}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
            />
          )}
          <Typography>
            {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton onClick={handleDrawerOpenClose}>
            {!open ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {SidebarData.map((item, index) => (
            <SubMenu item={item} key={index} open={open} />
          ))}
        </List>

        <Divider />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pl: 0,
          m: 0,
          transition: "margin-left 0.3s",
        }}
      >
        {page === "Dashboard" && <HomeContent />}
        {page === "Profile" && children}
        {page === "Course" && <CourseContent />}
        {page === "AssignmentViewingDetails" && (
          <AssignmentViewingDetailsMain course={children} />
        )}
        {page === "AssignmentViewingAll" && <AssignmentViewingAllMain />}
      </Box>
    </>
  );
}
