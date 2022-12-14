import { CircularProgress, LinearProgress } from "@mui/material";

import React, { useEffect } from "react";

import { groupByDate, YYYYMMDD } from "../../helper";
import DoughnutChart from "../../components/DoughnutChart";
import LoadingCircularBar from "../../components/LoadingCircularBar";
import useHTTP from "../../hooks/useHTTP";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryList, getWalletList } from "../../redux/globalSlice";
import AddIcon from "@mui/icons-material/AddCircle";

const startWith30Period = new Date();
startWith30Period.setDate(startWith30Period.getDate() - 30);
const start = YYYYMMDD(startWith30Period);
const end = YYYYMMDD(new Date());
const last7 = new Date();
last7.setDate(last7.getDate() - 6);
const last7Date = YYYYMMDD(last7);

const Overview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wallet_list, wallet_loading } = useSelector((state) => state.global);

  const {
    data: expenseByCategoryData,
    loading: expByCatLoading,
    call: callExpenseByCategoryData,
  } = useHTTP({
    url: `${process.env.REACT_APP_BACKEND_URL}/api/query/expenseincomebycategory`,
    method: "GET",
    initialValue: [],
    params: {
      start,
      end,
      offset: new Date().getTimezoneOffset(),
      type: "debit",
    },
  });

  const {
    data: incomevsexpData,
    loading: invsexLoading,
    call: callIncomeVsExpense,
  } = useHTTP({
    url: `${process.env.REACT_APP_BACKEND_URL}/api/query/incomevsexpense`,
    method: "GET",
    initialValue: [],
    params: {
      start,
      end,
      offset: new Date().getTimezoneOffset(),
    },
  });

  const incomevsexpDataChart = [
    {
      category: "Income",
      total: Math.abs(incomevsexpData.find((i) => i.total > 0)?.total || 0),
    },
    {
      category: "Expense",
      total: Math.abs(incomevsexpData.find((i) => i.total < 0)?.total || 0),
    },
  ];

  const {
    data: last7dayData,
    loading: last7Loading,
    call: last7DayCall,
  } = useHTTP({
    url: `${process.env.REACT_APP_BACKEND_URL}/api/query/advance`,
    method: "GET",
    initialValue: [],
    params: {
      start: last7Date,
      end,
      type: "debit",
    },
  });

  const last7DayChartData = groupByDate(7, last7dayData);

  useEffect(() => {
    callExpenseByCategoryData();
    callIncomeVsExpense();
    last7DayCall();
  }, [callExpenseByCategoryData, callIncomeVsExpense, last7DayCall]);

  useEffect(() => {
    dispatch(getCategoryList());
    dispatch(getWalletList());
  }, [dispatch]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: 10,
            paddingBottom: 10,
            overflowX: "auto",
          }}
        >
          {wallet_loading ? (
            <div style={{ width: "100%" }}>
              <LinearProgress />
            </div>
          ) : (
            <>
              {wallet_list.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: 5,
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 10,
                    border: "1px dashed gray",
                    padding: "10px 25px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: "lighter",
                      color: item.balance >= 0 ? "green" : "red",
                    }}
                  >
                    {item.balance.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "INR",
                    })}
                  </div>
                  <div
                    style={{
                      color: "gray",
                      textTransform: "uppercase",
                      fontSize: 15,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
              <div
                onClick={() => {
                  navigate("/wallet");
                }}
                style={{
                  cursor: "pointer",
                  background: "white",
                  borderRadius: 5,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 10,
                  border: "1px dashed gray",
                  padding: "10px 25px",
                }}
              >
                <AddIcon color="primary" />
                <div
                  style={{
                    color: "gray",
                    textTransform: "uppercase",
                    fontSize: 15,
                    whiteSpace: "nowrap",
                  }}
                >
                  New Wallet
                </div>
              </div>
            </>
          )}
        </div>

        <div className="doughnutContainer">
          {expByCatLoading ? (
            <LoadingCircularBar />
          ) : (
            <DoughnutChart
              label="Amount"
              clickHandler={() => {
                navigate("/overview/category", {
                  state: {
                    start,
                    end,
                    data: expenseByCategoryData,
                    period: { id: 30, name: "Last 30 Days" },
                    type: { id: "debit", name: "Expense" },
                  },
                });
              }}
              labels={expenseByCategoryData.map((i) => i.category)}
              data={expenseByCategoryData.map((i) => i.total)}
              center={{
                text: "Total Spent",
                amount: expenseByCategoryData.reduce(
                  (a, b) => a + Math.abs(b.total),
                  0
                ),
              }}
              unique_id_for_legend="expense_amount_spent_legend"
              headerText="Expense By Category"
              subHeaderText="Last 30 Days"
            />
          )}
        </div>

        <div className="doughnutContainer">
          {expByCatLoading ? (
            <LoadingCircularBar />
          ) : (
            <DoughnutChart
              label="Amount"
              clickHandler={() => {
                navigate("/overview/creditdebit", {
                  state: {
                    start,
                    end,
                    data: incomevsexpDataChart,
                    period: { id: 30, name: "Last 30 Days" },
                    type: { id: "debit", name: "Expense" },
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
              unique_id_for_legend="expense_vs_earn_amount_legend"
              headerText="Income Vs Expense"
              subHeaderText="Last 30 Days"
            />
          )}
        </div>

        <div
          style={{
            flexGrow: 1,
            minWidth: 300,
            border: "1px dashed gray",
            padding: 10,
          }}
        >
          <div style={{ marginTop: 5 }}>
            <div
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 20 }}
            >
              Daily Expenses
            </div>
            <div
              style={{
                fontWeight: "lighter",
                textAlign: "center",
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              Last 7 days
            </div>
          </div>
          <div style={{ width: "100%", textAlign: "center" }}>
            {last7Loading ? (
              <CircularProgress />
            ) : (
              <Bar
                data={{
                  labels: last7DayChartData.map((i, index) =>
                    index === last7DayChartData.length - 1
                      ? "Today"
                      : i.date.split("-")[2]
                  ),
                  datasets: [
                    {
                      label: "Expense",
                      data: last7DayChartData.map((i) => i.amount),
                      backgroundColor: "#F05365",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
