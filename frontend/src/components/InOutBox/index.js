import { Button, Card, Grid, LinearProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import SearchableDropdown from "../SearchableDropdown";
import axios from "axios";
import {
  getAuthTokenWithUID,
  getDateWithCurrentTime,
  YYYYMMDD,
} from "../../helper";
import toast from "react-hot-toast";

const InOutBox = ({
  refetch = () => {},
  mode = "add",
  categoryList = [],
  data = {},
}) => {
  const [category, setCategory] = useState(data.category || null);
  const [amount, setAmount] = useState(data.amount || "");
  const [description, setDescription] = useState(data.description || "");
  const [date, setDate] = useState(
    data.date ? YYYYMMDD(data.date) : YYYYMMDD(new Date().toString())
  );

  const [tLoading, setTLoading] = useState(false);
  const handleTransaction = async (mode) => {
    setTLoading(true);
    try {
      const body = {
        category: category.name,
        description,
        amount: mode === "in" ? Math.abs(amount) : 0 - Math.abs(amount),
      };

      const authTokens = await getAuthTokenWithUID();

      if (data.id) {
        const d1 = new Date(date);
        const d2 = new Date(data.date);
        if (
          !(
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
          )
        ) {
          body["date"] = getDateWithCurrentTime(date);
        }
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/expense`,
          {
            ...body,
            id: data.id,
          },
          {
            headers: {
              ...authTokens,
            },
          }
        );
        refetch({ ...body, id: data.id }, "edit");
      } else {
        body["date"] = getDateWithCurrentTime(date);

        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/expense`,
          body,
          {
            headers: {
              ...authTokens,
            },
          }
        );
        refetch({ ...body, id: data.data.insertId });
      }
      setAmount("");
      setDescription("");
      setDate(YYYYMMDD(new Date().toString()));
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setTLoading(false);
    }
  };

  const [dLoading, setDLoading] = useState(false);
  const deleteItem = async () => {
    setDLoading(true);
    try {
      const authTokens = await getAuthTokenWithUID();
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/expense`, {
        data: {
          id: data.id,
        },
        headers: {
          ...authTokens,
        },
      });
      toast.success("Deleted successfully");
      refetch({ ...data }, "delete");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setDLoading(false);
    }
  };

  return (
    <Card elevation={5} style={{ width: "100%", padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={mode === "edit" ? 6 : 2}>
          <SearchableDropdown
            required={true}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            items={categoryList}
            label="Select Category"
            name="category"
          />
        </Grid>
        <Grid item xs={12} md={mode === "edit" ? 6 : 2}>
          <TextField
            required
            size="small"
            type="number"
            label="Amount"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={mode === "edit" ? 6 : 3}>
          <TextField
            required={
              category && category.name.toLowerCase().startsWith("other")
            }
            size="small"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={mode === "edit" ? 6 : 2}>
          <TextField
            required
            size="small"
            type="date"
            label="Date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Grid>
        {(tLoading || dLoading) && (
          <Grid item xs={12} md={6}>
            <LinearProgress />
          </Grid>
        )}
        <Grid item xs={6} md={mode === "edit" ? 3 : 1.5}>
          <Button
            disabled={
              dLoading ||
              tLoading ||
              !amount ||
              !category ||
              (category &&
                category.name.toLowerCase().startsWith("other") &&
                !description) ||
              amount < 0
            }
            fullWidth
            style={{ height: "100%" }}
            color="success"
            variant="contained"
            onClick={() => {
              handleTransaction("in");
            }}
          >
            CASH IN (+)
          </Button>
        </Grid>
        <Grid item xs={6} md={mode === "edit" ? 3 : 1.5}>
          <Button
            disabled={
              dLoading ||
              tLoading ||
              !amount ||
              !category ||
              (category &&
                category.name.toLowerCase().startsWith("other") &&
                !description)
            }
            style={{ height: "100%" }}
            onClick={() => {
              handleTransaction("out");
            }}
            fullWidth
            color="error"
            variant="contained"
          >
            CASH OUT (-)
          </Button>
        </Grid>
        {mode === "edit" && (
          <>
            <Grid item xs={12} md={6}>
              <Button
                disabled={dLoading || tLoading}
                style={{ height: "100%" }}
                onClick={deleteItem}
                fullWidth
                color="secondary"
                variant="contained"
              >
                DELETE
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );
};

export default InOutBox;
