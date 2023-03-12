import React from "react";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  ListItemButton,
  MenuItem,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LoginModal from "../components/LoginModal";
import { UserContext } from "../App";

const Header = ({ setLoginModalOpen, notification }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [userData, setUserData] = useContext(UserContext);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLoginClick = () => {
    setIsDrawerOpen(false);
    setLoginModalOpen(true);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setAnchorEl(null);
    setUserData({
      isLogged: false,
      jwt: null,
      user: {},
    });
    notification(t("logoutSuccess"), 'warning');
  };

  const renderDesktopMenu = () => (
    <React.Fragment>
      <Button color="inherit" component={Link} to="/">
        {t("home")}
      </Button>
      <Button color="inherit" component={Link} to="/about">
        {t("about")}
      </Button>
      <Button color="inherit" component={Link} to="/contact">
        {t("contact")}
      </Button>
      {userData.isLogged ? (
              <div>
                <Button
                  color="inherit"
                  variant="outlined"
                  component={Link}
                  onClick={handleProfileMenu}
                  startIcon={<AccountCircle />}
                >
                  {userData.user?.name}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                >
                  <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
                </Menu>
              </div>
      ) : (
        <Button color="inherit" variant="outlined" onClick={handleLoginClick}>
          {t("login")}
        </Button>
      )}
    </React.Fragment>
  );

  const renderMobileMenu = () => (
    <React.Fragment>
      <IconButton onClick={toggleDrawer} color="inherit">
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{ width: 250, minWidth: 250 }}
      >
        <List>
          <ListItemButton component={Link} to="/">
            <ListItemText primary={t("home")} />
          </ListItemButton>
          <ListItemButton component={Link} to="/about">
            <ListItemText primary={t("about")} />
          </ListItemButton>
          <ListItemButton component={Link} to="/contact">
            <ListItemText primary={t("contact")} />
          </ListItemButton>
          <ListItem>
            {userData.isLogged ? (
              <div>
                <Button
                  color="inherit"
                  variant="outlined"
                  component={Link}
                  onClick={handleProfileMenu}
                  startIcon={<AccountCircle />}
                >
                  {userData.user?.name}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                >
                  <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleLoginClick}
              >
                {t("login")}
              </Button>
            )}
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t("app_name")}
          </Typography>
          {isMobile ? renderMobileMenu() : renderDesktopMenu()}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
