import { Card } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import DoughnutChart from "../../components/DoughnutChart";
import FilterBox from "../../components/FilterBox";
import LoadingCircularBar from "../../components/LoadingCircularBar";
import ResponsiveDataViewer from "../../components/ResponsiveDataViewer";
import { formatDate, YYYYMMDD } from "../../helper";

const columns = [
  {
    id: "date",
    label: "Date",
    format: (value) => formatDate(value),
  },
  {
    id: "category",
    label: "Category",
  },
  {
    id: "amount",
    label: "Amount",
    format: (value) => {
      return value > 0 ? (
        <span className="green">
          {(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: "currency",
            currency: "INR",
          })}
        </span>
      ) : (
        <span className="red">
          {(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: "currency",
            currency: "INR",
          })}
        </span>
      );
    },
  },
  {
    id: "description",
    label: "Description",
  },
  { id: "wallet_name", label: "Wallet Name" },
];

const ExpenseIncomeByCategory = () => {
  const location = useLocation();

  const walletRef = useRef({ id: 0, name: "All Wallets" });
  const periodRef = useRef(
    location.state?.period || { id: 30, name: "Last 30 Days" }
  );
  const startRef = useRef(location.state?.start || YYYYMMDD(new Date()));
  const endRef = useRef(location.state?.end || YYYYMMDD(new Date()));
  const typeRef = useRef(location.state?.type || null);

  const [data, setData] = useState(location.state?.data || []);
  const [loading, setLoading] = useState(false);
  const getExpenseCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/query/expenseincomebycategory`,
        {
          params: {
            start: startRef.current,
            end: endRef.current,
            wallet_id: walletRef.current?.id,
            type: typeRef.current?.id,
            offset: new Date().getTimezoneOffset(),
          },
        }
      );
      if (data.success) {
        setData(data.data);
      } else {
        toast.error(data.message || "Not found.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const getTransactionData = async () => {
    setTransactionsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/query/advance`,
        {
          params: {
            start: startRef.current,
            end: endRef.current,
            wallet_id: walletRef.current?.id,
            type: typeRef.current?.id,
            offset: new Date().getTimezoneOffset(),
          },
        }
      );
      if (data.success) {
        setTransactions(data.data);
      } else {
        toast.error(data.message || "Not found.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setTransactionsLoading(false);
    }
  };

  //   const [title, setTitle] = useState(
  //     typeRef.current && typeRef.current.id === "debit"
  //       ? "Expenses By Category"
  //       : "Income by Categories"
  //   );

  useEffect(() => {
    if (location.state && location.state.data) {
      getTransactionData();
    }
    if (location.state && !location.state.data) {
      getExpenseCategory();
      getTransactionData();
    }
    //  else {
    //   getExpenseCategory();
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [search, setSearch] = useState("");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        justifyContent: "center",
      }}
    >
      <Card
        elevation={5}
        style={{ padding: "20px 10px", width: "100%", minWidth: 300 }}
      >
        <FilterBox
          showType={true}
          defaultValues={{
            wallet: walletRef.current,
            period: periodRef.current,
            type: typeRef.current,
            start: startRef.current,
            end: endRef.current,
          }}
          handleSearch={(payload) => {
            startRef.current = payload.start;
            endRef.current = payload.end;
            walletRef.current = payload.wallet;
            periodRef.current = payload.period;
            typeRef.current = payload.type;
            getExpenseCategory();
            getTransactionData();
          }}
        />
      </Card>
      <div className="doughnutContainer">
        {loading ? (
          <LoadingCircularBar />
        ) : (
          <DoughnutChart
            label="Amount"
            clickHandler={(category) => {
              console.log(category);
            }}
            labels={data.map((i) => i.category)}
            data={data.map((i) => i.total)}
            center={{
              text:
                typeRef.current && typeRef.current.id === "debit"
                  ? "Money Spent"
                  : "Total Received",
              amount: data.reduce((a, b) => a + Math.abs(b.total), 0),
            }}
            unique_id_for_legend="amount_spent_legend"
            headerText={
              typeRef.current && typeRef.current.id === "debit"
                ? "Expenses By Category"
                : "Income by Category"
            }
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 300 }}>
        <ResponsiveDataViewer
          loading={transactionsLoading}
          columns={columns}
          data={transactions}
          refreshData={() => {}}
          getHeight={() => {
            return window.innerHeight - 200;
          }}
          search={search}
          setSearch={setSearch}
        />
      </div>
    </div>
  );
};

export default ExpenseIncomeByCategory;
