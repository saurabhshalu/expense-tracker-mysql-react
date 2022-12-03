import { Button, Card, Grid, TextField } from "@mui/material";
import axios from "axios";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CustomAccordion from "../../components/CustomAccordion";
import SearchableDropdown from "../../components/SearchableDropdown";
import { utils, writeFile } from "xlsx";
import {
  formatDate,
  formatDateTime,
  getAuthTokenWithUID,
  getDate30daysBefore,
  YYYYMMDD,
} from "../../helper";
import DoughnutChart from "./DoughnutChart";
import LoadingCircularBar from "../../components/LoadingCircularBar";
import BalanceCard from "../../components/BalanceCard";
import ResponsiveDataViewer from "../../components/ResponsiveDataViewer";
import { useSelector } from "react-redux";

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
];

const Overview = () => {
  const settingState = useSelector((state) => state.auth.setting);

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [overview, setOverview] = useState({});
  const [detailList, setDetailList] = useState([]);
  const [startDate, setStartDate] = useState(
    YYYYMMDD(getDate30daysBefore(new Date()))
  );
  const [endDate, setEndDate] = useState(YYYYMMDD(new Date()));
  const [category, setCategory] = useState(null);
  const [type, setType] = useState(null);

  const getCategory = async () => {
    setLoading(true);
    try {
      const authTokens = await getAuthTokenWithUID();
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/category`,
        {
          headers: {
            ...authTokens,
          },
        }
      );
      if (data.success) {
        setCategoryList(data.data);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const authTokens = await getAuthTokenWithUID();
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/report/overview`,
        {
          params: {
            start: startDate,
            end: endDate,
            offset: new Date().getTimezoneOffset(),
          },
          headers: {
            ...authTokens,
          },
        }
      );
      setOverview(data.data);
    } catch (error) {
      toast.error(
        error.response.data.message || error.message || "Failed to get data."
      );
    } finally {
      setLoading(false);
    }
  };

  const income = (overview.items || []).filter((item) => item.total >= 0);
  const expense = (overview.items || []).filter((item) => item.total < 0);

  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const expenseCategoryClickHandler = (category) => {
    getReport(category, "Expense");
    endPage.current.scrollIntoView({ behaviour: "smooth" });
  };
  const incomeCategoryClickHandler = (category) => {
    getReport(category, "Income");
    endPage.current.scrollIntoView({ behaviour: "smooth" });
  };

  const dateChangedRef = useRef(true);
  const endPage = useRef();

  const getDetails = async (mycat, mytype) => {
    setDetailsLoading(true);
    try {
      const params = {};
      if (mycat || category) {
        params.category = mycat || category.name;
      }
      if (mytype || type) {
        params.type = mytype || type.name;
      }
      if (startDate) {
        params.start = startDate;
      }
      if (endDate) {
        params.end = endDate;
      }

      const authTokens = await getAuthTokenWithUID();
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/report/details`,
        {
          params: { ...params, offset: new Date().getTimezoneOffset() },
          headers: {
            ...authTokens,
          },
        }
      );
      setDetailList(data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const getReport = async (mycat, mytype) => {
    setSearch("");
    if (dateChangedRef.current) {
      dateChangedRef.current = false;
      fetchOverviewData();
    }
    getDetails(mycat, mytype);
  };

  useEffect(() => {
    getReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            position: "relative",
            border: "1px dashed gray",
            flexDirection: "column",
            // height: "100%",
            minWidth: 360,
            flex: 1,
          }}
        >
          <CustomAccordion
            expanded={expanded}
            title={
              <div style={{ fontWeight: "bold" }}>
                Report{" "}
                <span
                  style={{
                    fontWeight: "normal",
                    fontStyle: "italic",
                    color: "darkblue",
                  }}
                >
                  {formatDate(startDate)}
                </span>{" "}
                to{" "}
                <span
                  style={{
                    fontWeight: "normal",
                    fontStyle: "italic",
                    color: "darkblue",
                  }}
                >
                  {formatDate(endDate)}
                </span>
              </div>
            }
            handleChange={() => {
              setExpanded((old) => !old);
            }}
          >
            <Card elevation={5} style={{ width: "100%", padding: 20 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SearchableDropdown
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                    items={categoryList}
                    label="Select Category"
                    name="category"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SearchableDropdown
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                    items={[{ name: "Income" }, { name: "Expense" }]}
                    label="Select Type"
                    name="type"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    fullWidth
                    size="small"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      dateChangedRef.current = true;
                      setStartDate(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="End Date"
                    name="endDate"
                    fullWidth
                    size="small"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      dateChangedRef.current = true;
                      setEndDate(e.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={6}>
                  <Button
                    disabled={loading || detailsLoading}
                    style={{ height: "100%" }}
                    onClick={() => {
                      getReport();
                    }}
                    fullWidth
                    color="primary"
                    variant="contained"
                  >
                    Get Report
                  </Button>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Button
                    disabled={detailList.length === 0}
                    style={{ height: "100%" }}
                    onClick={() => {
                      if (detailList.length > 0) {
                        const wb = utils.book_new();
                        const ws = utils.json_to_sheet(detailList);
                        utils.book_append_sheet(wb, ws);
                        writeFile(
                          wb,
                          `Report ${formatDateTime(new Date())}.xlsx`
                        );
                      } else {
                        toast.error("No records found.");
                      }
                    }}
                    fullWidth
                    color="secondary"
                    variant="outlined"
                  >
                    Download
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </CustomAccordion>

          <Grid
            container
            gap={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 10px",
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            {settingState.openingBalance &&
              overview.closingBalance &&
              overview.closingBalance.length > 0 &&
              overview.closingBalance[0].total && (
                <Grid item xs={12} md={3.5}>
                  <BalanceCard
                    title="Opening Balance"
                    amount={overview.closingBalance[0].total}
                    msg={`On ${formatDate(startDate)}`}
                    style={{ color: "maroon" }}
                  />
                </Grid>
              )}
            {settingState.closingBalance &&
              overview.afterLastDateBalance &&
              overview.afterLastDateBalance.length > 0 &&
              overview.afterLastDateBalance[0].total && (
                <Grid item xs={12} md={3.5}>
                  <BalanceCard
                    title="Closing Balance"
                    amount={
                      overview.closingBalance[0].total +
                      income.reduce((a, b) => a + Math.abs(b.total), 0) -
                      expense.reduce((a, b) => a + Math.abs(b.total), 0)
                    }
                    style={{ color: "hotpink" }}
                    msg={`As On ${formatDate(endDate)}`}
                  />
                </Grid>
              )}
            {settingState.availableBalance && overview.closingBalance && (
              <Grid item xs={12} md={3.5}>
                <BalanceCard
                  title="Available Balance"
                  style={{ color: "green" }}
                  amount={
                    overview.closingBalance[0].total +
                    (overview.afterLastDateBalance[0].total || 0) +
                    income.reduce((a, b) => a + Math.abs(b.total), 0) -
                    expense.reduce((a, b) => a + Math.abs(b.total), 0)
                  }
                  msg="As of Today"
                />
              </Grid>
            )}
          </Grid>
        </div>
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
              clickHandler={expenseCategoryClickHandler}
              labels={expense.map((i) => i.category)}
              data={expense.map((i) => i.total)}
              center={{
                text: "Money Spent",
                amount: expense.reduce((a, b) => a + Math.abs(b.total), 0),
              }}
              unique_id_for_legend="amount_spent_legend"
            />
          )}
        </div>
        {settingState.moneyReceivedChart && (
          <div
            style={{
              width: 360,
              position: "relative",
              border: "1px dashed gray",
              alignItems: "stretch",
            }}
          >
            {loading ? (
              <LoadingCircularBar />
            ) : (
              <DoughnutChart
                label="Amount"
                clickHandler={incomeCategoryClickHandler}
                labels={income.map((i) => i.category)}
                data={income.map((i) => i.total)}
                center={{
                  text: "Money Received",
                  amount: income.reduce((a, b) => a + Math.abs(b.total), 0),
                }}
                unique_id_for_legend="amount_received_legend"
              />
            )}
          </div>
        )}

        <div ref={endPage}></div>
        <div
          style={{
            position: "relative",
            // border: "1px dashed gray",
            display: "flex",
            width: "100%",
            minWidth: 360,
          }}
        >
          <ResponsiveDataViewer
            search={search}
            setSearch={setSearch}
            loading={detailsLoading}
            columns={columns}
            data={detailList}
            getHeight={() => {
              return 600;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
