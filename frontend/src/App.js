import React, { Suspense, useEffect, useState } from "react";
import { Container, LinearProgress } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import { getAuth } from "firebase/auth";
import { login } from "./redux/authSlice";
import Overlay from "./components/Overlay/Overlay";
import Error404 from "./components/Error404/Error404";
import CategoryScreen from "./screens/CategoryScreen";
import Overview from "./screens/ReportScreen/Overview";
import SettingScreen from "./screens/SettingScreen";
import ExpenseIncomeByCategory from "./screens/ReportScreen/ExpenseIncomeByCategory";
import CreditDebitScreen from "./screens/ReportScreen/CreditDebitScreen";
import HistoryScreen from "./screens/HistoryScreen";
import WalletScreen from "./screens/WalletScreen";

const App = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      dispatch(login());
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) {
    return <LinearProgress />;
  }
  return (
    <div>
      <BrowserRouter>
        <Navbar />

        <Container
          sx={{
            paddingLeft: "auto",
            paddingRight: "auto",
            paddingTop: "16px !important",
          }}
          maxWidth="xl"
        >
          <Suspense fallback={<Overlay open={true} />}>
            <Routes>
              <Route path="/login" element={<LoginScreen />} />

              <Route
                path="/"
                element={user.admin ? <Overview /> : <Navigate to="/login" />}
              />

              <Route
                path="/category"
                element={
                  user.admin ? <CategoryScreen /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/wallet"
                element={
                  user.admin ? <WalletScreen /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/overview"
                element={user.admin ? <Overview /> : <Navigate to="/login" />}
              />

              <Route
                path="/overview/category"
                element={
                  user.admin ? (
                    <ExpenseIncomeByCategory />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/overview/creditdebit"
                element={
                  user.admin ? <CreditDebitScreen /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/history"
                element={
                  user.admin ? <HistoryScreen /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/settings"
                element={
                  user.admin ? <SettingScreen /> : <Navigate to="/login" />
                }
              />

              <Route path="*" element={<Error404 />} />
            </Routes>
          </Suspense>
        </Container>

        <Toaster
          position="bottom-center"
          toastOptions={{ style: { background: "#333", color: "#FFF" } }}
        />
      </BrowserRouter>
    </div>
  );
};

export default App;
