import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import CustomAccordion from "../components/CustomAccordion";
import FilterBox from "../components/FilterBox";
import ResponsiveDataViewer from "../components/ResponsiveDataViewer";
import { formatDate, getDate30daysBefore, YYYYMMDD } from "../helper";

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

const HistoryScreen = () => {
  const location = useLocation();

  const walletRef = useRef(
    location.state?.wallet || { id: 0, name: "All Wallets" }
  );
  const periodRef = useRef(
    location.state?.period || { id: 30, name: "Last 30 Days" }
  );
  const startRef = useRef(
    location.state?.start || YYYYMMDD(getDate30daysBefore(new Date()))
  );
  const endRef = useRef(location.state?.end || YYYYMMDD(new Date()));

  const categoryRef = useRef(
    location.state?.category || { id: "", name: "All Categories" }
  );

  const typeRef = useRef(location.state?.type || null);

  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setTransactions([]);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/query/advance`,
        {
          params: {
            start: startRef.current,
            end: endRef.current,
            wallet_id: walletRef.current?.id,
            type: typeRef.current?.id,
            category: categoryRef.current?.id,
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <CustomAccordion
        expanded={expanded}
        title={<div style={{ fontWeight: "bold" }}>Advance Filter</div>}
        handleChange={() => {
          setExpanded((old) => !old);
        }}
      >
        <FilterBox
          showCategory={true}
          showType={true}
          defaultValues={{
            wallet: walletRef.current,
            period: periodRef.current,
            category: categoryRef.current,
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
            categoryRef.current = payload.category;
            fetchData();
          }}
        />
      </CustomAccordion>
      <div>
        <ResponsiveDataViewer
          loading={loading}
          columns={columns}
          data={transactions}
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

export default HistoryScreen;
