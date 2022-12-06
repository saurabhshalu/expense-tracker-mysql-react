import { Card } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import DoughnutChart from "../../components/DoughnutChart";
import FilterBox from "../../components/FilterBox";
import LoadingCircularBar from "../../components/LoadingCircularBar";
import { YYYYMMDD } from "../../helper";

const ExpenseIncomeByCategory = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (location.state && !location.state.data) {
      getExpenseCategory();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              navigate("/history", {
                state: {
                  wallet: walletRef.current,
                  start: startRef.current,
                  end: endRef.current,
                  period: periodRef.current,
                  type: typeRef.current,
                  category: { id: category, name: category },
                },
              });
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
    </div>
  );
};

export default ExpenseIncomeByCategory;
