import { Card } from "@mui/material";
import React, { useEffect } from "react";
import { YYYYMMDD } from "../helper";
import useHTTP from "../hooks/useHTTP";
import DoughnutChart from "./DoughnutChart";
import FilterBox from "./FilterBox";
import LoadingCircularBar from "./LoadingCircularBar";

const startWith30Period = new Date();
startWith30Period.setDate(startWith30Period.getDate() - 30);
const start = YYYYMMDD(startWith30Period);
const end = YYYYMMDD(new Date());

const defaultFilterValues = {
  wallet: { id: 0, name: "All Wallets" },
  type: { id: "", name: "All" },
  category: { id: "", name: "All Categories" },
  period: { id: 30, name: "Last 30 Days" },
  start,
  end,
};

const ExpenseByCategory = () => {
  const { data, loading, call } = useHTTP({
    url: `${process.env.REACT_APP_BACKEND_URL}/api/query/expensebycategory`,
    method: "GET",
    initialValue: [],
    params: {
      start,
      end,
    },
  });

  useEffect(() => {
    call();
  }, [call]);
  return (
    <div
      style={{
        // width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* {treatAsPage && (
        <Card
          elevation={5}
          style={{
            padding: "20px 10px",
            border: "1px dashed gray",
            background: "white",
            borderRadius: 5,
            width: "100%",
          }}
        >
          <FilterBox
            showCategory={true}
            showType={true}
            defaultValues={defaultFilterValues}
          />
        </Card>
      )} */}

      <div
        style={{
          width: 360,
          position: "relative",
          border: "1px dashed gray",
          alignItems: "stretch",
          justifyContent: "center",
          minHeight: 360,
        }}
      >
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
              text: "Money Spent",
              amount: data.reduce((a, b) => a + Math.abs(b.total), 0),
            }}
            unique_id_for_legend="amount_spent_legend"
            headerText="Expense By Category"
            subHeaderText={defaultFilterValues.period.name}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseByCategory;
