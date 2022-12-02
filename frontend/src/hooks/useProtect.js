import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
const useProtect = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { authenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user || authenticated) {
        setLoading(false);
      } else {
        navigate("/login");
      }
    });
  }, [auth, navigate, authenticated]);

  return loading;
};

export default useProtect;
