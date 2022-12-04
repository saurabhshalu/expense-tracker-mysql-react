import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import InOutBox from "../../components/InOutBox";

import CustomDialog from "../../components/CustomDialog";
import { formatDate, getAuthTokenWithUID } from "../../helper";
import ResponsiveDataViewer from "../../components/ResponsiveDataViewer";
import { useSelector } from "react-redux";
import useHTTP from "../../hooks/useHTTP";
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
  {
    id: "RunningTotal",
    label: "Balance",
    format: (value) => {
      return value > 0 ? (
        <span className="pbal">
          {(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: "currency",
            currency: "INR",
          })}
        </span>
      ) : (
        <span className="nbal">
          {(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: "currency",
            currency: "INR",
          })}
        </span>
      );
    },
  },
];

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);

      const authTokens = await getAuthTokenWithUID();
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/transactions`,
        {
          headers: {
            ...authTokens,
          },
        }
      );
      if (data.success) {
        setData(data.data);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const { data: walletBalance, call: callWalletBalance } = useHTTP({
    url: `${process.env.REACT_APP_BACKEND_URL}/api/wallets/balance`,
    method: "GET",
    initialValue: [],
  });

  const [walletBalanceList, setWalletBalanceList] = useState(walletBalance);

  useEffect(() => {
    setWalletBalanceList(walletBalance);
  }, [walletBalance]);

  useEffect(() => {
    getData();
    callWalletBalance();
  }, [callWalletBalance]);

  const ref = useRef();
  const itemsRef = useRef();
  const refetchData = (payload, mode = "add") => {
    if (mode === "add") {
      setData((old) => [
        {
          ...payload,
          wallet_name: walletBalanceList.find((i) => i.id === payload.wallet_id)
            .name,
        },
        ...old,
      ]);
      setWalletBalanceList((old) =>
        old.map((i) => {
          if (i.id === payload.wallet_id) {
            return { ...i, balance: i.balance + payload.amount };
          }
          return i;
        })
      );
    } else if (mode === "edit") {
      getData();
      callWalletBalance();
      setOpen(false);
      setSelectedItem({});
    } else if (mode === "delete") {
      getData();
      callWalletBalance();
      setOpen(false);
      setSelectedItem({});
    }

    if (itemsRef.current) {
      itemsRef.current.resetAfterIndex(0);
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [search, setSearch] = useState("");

  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const getData = async () => {
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
      }
    };
    getData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <CustomDialog
        open={open}
        title="Edit Transaction"
        handleClose={() => setOpen(false)}
      >
        <InOutBox
          refetch={refetchData}
          mode="edit"
          data={{
            ...selectedItem,
            category: {
              name: selectedItem.category,
            },
          }}
          categoryList={categoryList}
          walletBalanceList={walletBalanceList}
        />
      </CustomDialog>
      <div style={{ width: "100%" }} ref={ref}>
        <InOutBox
          refetch={refetchData}
          categoryList={categoryList}
          walletBalanceList={walletBalanceList}
        />
      </div>
      <ResponsiveDataViewer
        search={search}
        setSearch={setSearch}
        loading={loading}
        columns={columns}
        data={data}
        getHeight={() => {
          if (!ref.current) {
            return 0;
          }
          return (
            window.innerHeight -
            ref.current.offsetHeight -
            ref.current.offsetTop -
            100
          );
        }}
        refreshData={getData}
        handleItemClick={(row) => {
          setSelectedItem(row);
          setOpen(true);
        }}
      />
    </div>
  );
};

export default HomeScreen;
