import { useState } from 'react';
import { Box, styled, useTheme, Toolbar, List,
  CssBaseline, Typography, Divider, IconButton,
 Menu as MenuComponent, MenuItem, Container
} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import HomeContent from './HomeContent';

import { Home, Menu as MenuIcon, School,  ChevronLeft, ChevronRight, AccountCircle, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AppName from "./WebName";
import { useAuth } from "../hook/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import SubMenu from './Submenu.jsx';

const drawerWidth = 240;


const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <Home />

  },
  {
    title: 'Courses',
    path: '/',
    icon: <School />,
    iconClosed: <KeyboardArrowDown sx={{display: "flex", alignItems: "center", ml: 2}} />,
    iconOpened: <KeyboardArrowUp sx={{display: "flex", alignItems: "center", ml: 2}} />,

    subNav: [
      {
        title: 'Course 1',
        path: '/',
        icon: <School />
      },
      {
        title: 'Course 2',
        path: '/',
        icon: <School />
      }
    ]
  },
];
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const { logout, isAuthenticated } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [menuData, setMenuData] = useState("Home");
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);



  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
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
      <MenuItem onClick={() => navigate('/user/profile')}>Profile</MenuItem>
      <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={ () =>  {
        logout()
        setAnchorEl(null)
      }} sx={{ color: "red" }}>
        Log out
      </MenuItem>
    </MenuComponent>
  );

  const navigate = useNavigate();
  const handleCloseNavMenu = (path) => {
    setAnchorEl(null);
    if (path) {
      navigate(path);
    }
  };
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed"
      elevation={4}
      open={open}
      sx={{
        bgcolor: "#FFF",
        color: "#2f2f2f"
      }}>
         <Container maxWidth="x1">
        <Toolbar sx={{maxHeight: "10vh"}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=> setOpen(!open)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>

          <AppName />
          <Box sx={{ flexGrow: 1 }}>
                <Typography color="#5f6368"  sx={{
                    fontWeight: "medium",
                    fontSize: "20px"
                }}>
                    Dashboard
                </Typography>
            </Box>

            <Box
              sx={{ display: { xs: "none", md: "flex", alignItems: "center" } }}
              style={{ marginLeft: "100px" }}
            >
        
              {isAuthenticated() &&
                (
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle
                    sx={{
                        width: "35px",
                        height: "35px"
                      }}
                  />
                </IconButton>
              )}
  
            </Box>
        </Toolbar>
        </Container>
        {renderMenu}
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={()=>setOpen(!open)}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>
        <Divider />
       
        <List>
      
        {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} open={open} />;
            })}
      
        </List>


        <Divider />
  
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
       {menuData =="Home" && <HomeContent/> }
      </Box>
    </>
  );
}