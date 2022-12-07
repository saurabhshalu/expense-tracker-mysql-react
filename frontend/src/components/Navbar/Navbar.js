import React from "react";
import styles from "./Navbar.module.css";
import {
  Avatar,
  Container,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { Box } from "@mui/system";
import { logout } from "../../redux/authSlice";
import { closeModal, openModal } from "../../redux/globalSlice";
import AddIcon from "@mui/icons-material/Add";
import CustomDialog from "../CustomDialog";
import InOutBox from "../InOutBox";
const Navbar = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { authenticated, user } = useSelector((state) => state.auth);

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { open, selected_item, edit_mode } = useSelector(
    (state) => state.global.form
  );
  const category_list = useSelector((state) => state.global.category_list);
  const wallet_list = useSelector((state) => state.global.wallet_list);

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

        <div style={{ display: "flex" }}>
          {user.admin && (
            <div className="addTransaction">
              <Fab
                color="primary"
                variant="circular"
                onClick={() => {
                  if (location.pathname !== "/history") {
                    navigate("/history");
                  }
                  dispatch(
                    openModal({
                      open: true,
                      edit_mode: false,
                      selected_item: {},
                    })
                  );
                }}
              >
                <AddIcon />
              </Fab>
            </div>
          )}

          {user.admin && open && (
            <CustomDialog
              open={open}
              title={edit_mode ? "Edit Transaction" : "Add Transaction"}
              handleClose={() =>
                dispatch(closeModal({ force_refetch: false, added_data: null }))
              }
            >
              <InOutBox
                refetch={() => {}}
                mode="edit"
                data={selected_item}
                edit_mode={edit_mode}
                categoryList={category_list}
                walletBalanceList={wallet_list}
              />
            </CustomDialog>
          )}

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
                      <AccountCircleIcon
                        style={{ margin: 0, color: "black" }}
                      />
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
                      navigate("/wallet");
                    }}
                  >
                    Wallets
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
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
