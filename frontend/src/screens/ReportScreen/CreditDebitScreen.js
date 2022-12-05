import { Card } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import DoughnutChart from "../../components/DoughnutChart";
import FilterBox from "../../components/FilterBox";
import LoadingCircularBar from "../../components/LoadingCircularBar";
import { YYYYMMDD } from "../../helper";

const CreditDebitScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const walletRef = useRef({ id: 0, name: "All Wallets" });
  const periodRef = useRef(
    location.state?.period || { id: 30, name: "Last 30 Days" }
  );
  const startRef = useRef(location.state?.start || YYYYMMDD(new Date()));
  const endRef = useRef(location.state?.end || YYYYMMDD(new Date()));

  const [data, setData] = useState([]);
  const incomevsexpDataChart = [
    {
      category: "Income",
      total: Math.abs(data.find((i) => i.total > 0)?.total || 0),
    },
    {
      category: "Expense",
      total: Math.abs(data.find((i) => i.total < 0)?.total || 0),
    },
  ];
  const [loading, setLoading] = useState(false);
  const getIncomeVsExpense = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/query/incomevsexpense`,
        {
          params: {
            start: startRef.current,
            end: endRef.current,
            wallet_id: walletRef.current?.id,
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
    getIncomeVsExpense();
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
          defaultValues={{
            wallet: walletRef.current,
            period: periodRef.current,
            start: startRef.current,
            end: endRef.current,
          }}
          handleSearch={(payload) => {
            startRef.current = payload.start;
            endRef.current = payload.end;
            walletRef.current = payload.wallet;
            periodRef.current = payload.period;
            getIncomeVsExpense();
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
              navigate("/overview/category", {
                state: {
                  start: startRef.current,
                  end: endRef.current,
                  period: periodRef.current,
                  type:
                    category === "Expense"
                      ? { id: "debit", name: "Expense" }
                      : { id: "credit", name: "Income" },
                },
              });
            }}
            labels={incomevsexpDataChart.map((i) => i.category)}
            data={incomevsexpDataChart.map((i) => i.total)}
            center={{
              text: "Net Cash Flow",
              amount:
                incomevsexpDataChart[0].total - incomevsexpDataChart[1].total,
            }}
            unique_id_for_legend="amount_spent_legend"
            headerText="Income Vs Expense"
          />
        )}
      </div>
    </div>
  );
};

export default CreditDebitScreen;
