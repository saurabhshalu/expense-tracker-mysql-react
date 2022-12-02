import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import styles from "./LoginScreen.module.css";
import { toast } from "react-hot-toast";
import { provider } from "../../helper/Firebase";
import { login, logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { getAuth, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (email && auth.currentUser) {
      auth.currentUser.getIdTokenResult().then(({ claims }) => {
        if (claims.admin) {
          navigate(`/`, {
            replace: true,
          });
        } else {
          dispatch(logout());
          toast.error(
            "You are not authorized to access this application, take the special permission from Admin to get the access."
          );
          setLoading(false);
        }
      });
    }
  }, [email, auth, navigate, dispatch]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setEmail(user?.email);
      if (!user) {
        setLoading(false);
      }
    });
  }, [auth]);

  const loginHandler = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      dispatch(login());
    } catch (error) {
      toast.error(error.message || "Something went wrong, Please login again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.newContainer}>
      <div className={styles.container}>
        <Button
          onClick={loginHandler}
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          disabled={loading}
          fullWidth
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginScreen;
