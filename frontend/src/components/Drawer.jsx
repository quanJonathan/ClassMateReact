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
import { stringAvatar } from "../helpers/stringAvator.js";
import axios from "axios";

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
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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

export default function MiniDrawer({ children, page }) {
  const { logout, isAuthenticated, user } = useAuth();
  // console.log(user);
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogAddOpen, setDialogAddOpen] = useState(false);
  const [isDialogJoinOpen, setDialogJoinOpen] = useState(false);

  const location = useLocation();
  // console.log(location)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
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
  const renderMenu = (
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
      <AppBar
        position="absolute"
        elevation={4}
        open={open}
        sx={{
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
                sx={{ fontSize: "1.5rem" }}
              >
                <Link
                  color="inherit"
                  onClick={() => navigate(`/c/${children?.classId?._id}`)}
                  sx={{ fontSize: "1.5rem" }}
                >
                  {children?.className}
                </Link>
              </Breadcrumbs>
            </Stack>

            <Box
              sx={{
                display: {
                  xs: "none",
                  ml: "auto",
                  alignItems: "start",
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
                        ? `${user.lastName} ${user.firstName}`
                        : "Default Name"
                    )}
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ml: 2}}
                  >
                    {/* <AccountCircle sx={{ width: "40px", height: "40px" }} /> */}
                  </Avatar>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
        {renderMenu}
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar />
        <DrawerHeader>
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
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
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
      </Box>
    </>
  );
}
