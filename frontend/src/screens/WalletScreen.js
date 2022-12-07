import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTableWithPage from "../components/CustomTableWithPage/CustomTableWithPage";
import { Button, Card, Grid, IconButton, TextField } from "@mui/material";
import { getAuthTokenWithUID } from "../helper";
import SearchableDropdown from "../components/SearchableDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getWalletList } from "../redux/globalSlice";
const columns = [
  { id: "name", label: "Name" },
  {
    id: "balance",
    label: "Balance",
    format: (value) => (
      <span style={{ color: value >= 0 ? "green" : "red" }}>
        {Number(value).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          style: "currency",
          currency: "INR",
        })}
      </span>
    ),
  },
  { id: "action", label: "Action" },
];
const WalletScreen = () => {
  const dispatch = useDispatch();
  const [walletName, setWalletName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState(null);

  const [loadingAdd, setLoadingAdd] = useState(false);

  const { wallet_list, wallet_loading: loading } = useSelector(
    (state) => state.global
  );

  const walletList = wallet_list.map((i) => ({
    ...i,
    action: (
      <IconButton
        onClick={() => {
          deleteWallet(i.id);
        }}
      >
        <DeleteIcon />
      </IconButton>
    ),
  }));

  useEffect(() => {
    dispatch(getWalletList());
  }, [dispatch]);

  const deleteWallet = async (id) => {
    try {
      const authTokens = await getAuthTokenWithUID();
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${id}`,
        {
          headers: {
            ...authTokens,
          },
        }
      );
      toast.success("Deleted successfully");
      dispatch(getWalletList());
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to delete"
      );
    }
  };

  const addWallet = async () => {
    setLoadingAdd(true);
    try {
      const authTokens = await getAuthTokenWithUID();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets`,
        {
          name: walletName,
          balance: balance,
          type: type?.id,
        },
        {
          headers: {
            ...authTokens,
          },
        }
      );
      toast.success("Added successfully");
      setBalance("");
      setWalletName("");
      setType(null);

      dispatch(getWalletList());
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to Add"
      );
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div>
      <Card style={{ padding: "10px", marginBottom: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              size="small"
              label="Wallet Name"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              size="small"
              label="Opening Balance"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <SearchableDropdown
              fullWidth
              disableClearable={true}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              items={[
                { id: "debit", name: "Debit" },
                { id: "credit", name: "Credit" },
              ]}
              label="Wallet Type"
              name="type"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              onClick={addWallet}
              disabled={loadingAdd || !walletName || !balance || !type?.id}
              size="small"
              variant="contained"
              fullWidth
            >
              Add Wallet
            </Button>
          </Grid>
        </Grid>
      </Card>

      <CustomTableWithPage
        columns={columns}
        rows={walletList}
        loading={loading}
      />
    </div>
  );
};

export default WalletScreen;
