import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { YYYYMMDD } from "../helper";
import SearchableDropdown from "./SearchableDropdown";

const FilterBox = ({
  handleSearch,
  showCategory,
  showType,
  defaultValues = {},
  typeClearable = true,
}) => {
  const wallet_list = useSelector((state) => state.global.wallet_list);
  const category_list = useSelector((state) => state.global.category_list);
  const [wallet, setWallet] = useState(defaultValues.wallet);
  const [type, setType] = useState(defaultValues.type);
  const [category, setCategory] = useState(defaultValues.category);
  const [period, setPeriod] = useState(defaultValues.period);
  const [startDate, setStartDate] = useState(defaultValues.start);
  const [endDate, setEndDate] = useState(defaultValues.end);

  const searchData = async () => {
    if (!period) {
      toast.error("Please select Period.");
      return;
    }
    const startWithPeriod = new Date();
    if (period.id !== 0) {
      startWithPeriod.setDate(startWithPeriod.getDate() - period.id);
    }
    const start = period.id === 0 ? startDate : YYYYMMDD(startWithPeriod);
    const end = period.id === 0 ? endDate : YYYYMMDD(new Date());

    const payload = {
      start,
      end,
      offset: new Date().getTimezoneOffset(),
      wallet: wallet,
      category: category,
      type: type,
      period: period,
    };

    handleSearch(payload);
  };

  return (
    <Grid container spacing={1.5}>
      <Grid item xs={12} md={2}>
        <SearchableDropdown
          required={true}
          disableClearable
          value={wallet}
          onChange={(e) => {
            setWallet(e.target.value);
          }}
          items={[{ id: 0, name: "All Wallets" }, ...wallet_list]}
          label="Select Wallet"
          name="wallet"
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <SearchableDropdown
          required={true}
          disableClearable
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
          }}
          items={[
            { id: 0, name: "Custom" },
            { id: 7, name: "Last 7 Days" },
            { id: 30, name: "Last 30 Days" },
            { id: 90, name: "Last 90 Days" },
          ]}
          label="Select Period"
          name="period"
        />
      </Grid>

      {period && period.id === 0 && (
        <>
          <Grid item xs={12} md={2}>
            <TextField
              label="Start Date"
              name="startDate"
              fullWidth
              size="small"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="End Date"
              name="endDate"
              fullWidth
              size="small"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
          </Grid>
        </>
      )}
      {showCategory && (
        <Grid item xs={12} md={2}>
          <SearchableDropdown
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            items={[{ id: "", name: "All Categories" }, ...category_list]}
            label="Category"
            name="category"
          />
        </Grid>
      )}

      {showType && (
        <Grid item xs={12} md={2}>
          <SearchableDropdown
            disableClearable={!typeClearable}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
            items={[
              { id: "debit", name: "Expense" },
              { id: "credit", name: "Income" },
            ]}
            label="Transaction Type"
            name="type"
          />
        </Grid>
      )}
      <Grid item xs={12} md={2}>
        <Button
          onClick={searchData}
          fullWidth
          variant="outlined"
          color="primary"
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterBox;
