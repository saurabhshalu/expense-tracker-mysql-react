import React from "react";
import styles from "./Navbar.module.css";
import {
  Avatar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { Box } from "@mui/system";
import { logout } from "../../redux/authSlice";
const Navbar = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authenticated, user } = useSelector((state) => state.auth);

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <nav className={styles.nav}>
      <Container maxWidth="xl" className={styles.navContainer}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link className={styles.brand} to="/">
            ExpenseTracker
          </Link>
        </div>
        <div className={styles.menu_container}>
          <Box sx={{ flexGrow: 1, textAlign: "right" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 4 }}>
                {auth.currentUser ? (
                  <Avatar alt="user" src={auth.currentUser.photoURL} />
                ) : authenticated ? (
                  <Avatar alt="user">G</Avatar>
                ) : (
                  <Avatar alt="user">
                    <AccountCircleIcon style={{ margin: 0, color: "black" }} />
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {authenticated && (
                <MenuItem style={{ fontWeight: "bold", cursor: "default" }}>
                  Hello, {user.name}
                </MenuItem>
              )}

              {authenticated && (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/overview");
                  }}
                >
                  Overview
                </MenuItem>
              )}

              {authenticated && (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/history");
                  }}
                >
                  Transactions
                </MenuItem>
              )}

              {authenticated && (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/category");
                  }}
                >
                  Category
                </MenuItem>
              )}

              {authenticated && (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/settings");
                  }}
                >
                  Settings
                </MenuItem>
              )}

              {authenticated && (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    dispatch(logout());
                    navigate("/login");
                  }}
                >
                  Logout
                </MenuItem>
              )}

              {!authenticated && (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/login");
                  }}
                >
                  Login
                </MenuItem>
              )}
            </Menu>
          </Box>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
