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
  ListItemText,
  Menu,
  ListItemIcon,
  useMediaQuery
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
  Assignment,
} from "@mui/icons-material";
import AppName from "./WebName";
import { useAuth } from "../hook/useAuth.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SubMenu from "./Submenu.jsx";
import { useSideNavGenerator } from "../helpers/sideNavGenerator";
import { Stack } from "@mui/system";
import CourseContent from "../components/CourseContent.jsx";
import OptionMenu from "./OptionMenu.jsx";
import FullScreenDialog from "./FullScreenDialog.jsx";
import { stringAvatar } from "../helpers/stringAvator";
import axios from "axios";
import AssignmentViewingDetails from "../routes/assignment-viewing-details.jsx";
import AssignmentViewingAll, { AssignmentViewingAllMain } from "../routes/assignment-viewing-all.jsx";
import AddPeopleDialog from "./AddPeopleDialog.jsx";
import CreateClassDialog from "./CreateClassDialog.jsx";

const drawerWidth = 280;
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

const Drawer = styled(MuiDrawer, 
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
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const { logout, isAuthenticated, user } = useAuth();
  // console.log(user);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogAddOpen, setDialogAddOpen] = useState(false);
  const [isDialogJoinOpen, setDialogJoinOpen] = useState(false);

  const location = useLocation();
  // console.log(location)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.target);
    console.log(event.target);
  };

  const handleDrawerOpenClose = () => {
    setOpen(!open);
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
  const renderMenu =(anchorEl) => (
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
      <AppBar
        position={true ? "fixed" : "absolute"}
        elevation={1}
        open={open}
        sx={{
          height: "70px",
          bgcolor: "#FFF",
          color: "#2f2f2f",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              height: { xs: "12vh", md: "10vh" },
              justifyContent: "space-between",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpenClose}
              edge="start"
            >
              <MenuIcon />
            </IconButton>

            <AppName />
           
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Breadcrumbs
                separator="›"
                aria-label="breadcrumb"
                sx={{ fontSize: "25px" }}
              >
                   {children &&
                <Link
                  color="inherit"
                  onClick={() => navigate(`/c/${children?.classId?._id}`)}
                  sx={{ fontSize: "15px" }}
                >
                  {`> ${children?.className}`}
                </Link>}
              </Breadcrumbs>
            </Stack>

            <Box
              sx={{
                display: {
                  xs: "none",
                  ml: "auto",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  md: "flex",
                },
              }}
            >
              {isAuthenticated() && (
                <>
                  {location.pathname === "/dashboard" && (
                    <OptionMenu options={options} actionIcon={<Add />} />
                  )}
                  <Avatar
                    {...stringAvatar(
                      user
                        ? `${user.firstName} ${user.lastName}`
                        : "Default Name",
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
                  >
                    {/* <AccountCircle sx={{ width: "40px", height: "40px" }} /> */}
                  </Avatar>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
        {renderMenu(anchorEl)}
      </AppBar>
      <Drawer variant={lgUp ? "permanent" : "temporary"} open={open} onClose={handleDrawerOpenClose}>
        <Toolbar />
        <DrawerHeader sx={{paddingTop: '10%'}}>
          {isAuthenticated() && open && (
            <IconButton
              size="large"
              edge="start"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle sx={{ width: "70px", height: "70px" }} />
            </IconButton>
          )}
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
          p: 3,
          transition: "margin-left 0.3s",
        }}
      >
        {page === "Dashboard" && <HomeContent />}
        {page === "Profile" && children}
        {page === "Course" && <CourseContent />}
        {page === "AssignmentViewingDetails" && <AssignmentViewingDetails/>}
        {page === "AssignmentViewingAll" && <AssignmentViewingAllMain/>}
      </Box>
    </>
  );
}
