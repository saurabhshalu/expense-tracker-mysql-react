import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { VariableSizeList as List } from "react-window";
import {
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import CustomTableWithPage from "./CustomTableWithPage/CustomTableWithPage";
import TransactionCard from "./TransactionCard";

const mql = window.matchMedia("(max-width: 600px)");

const ResponsiveDataViewer = ({
  columns = [],
  data = [],
  loading = false,
  handleItemClick,
  refreshData,
  getHeight = () => {
    return 0;
  },
  search = "",
  setSearch = () => {},
}) => {
  const [height, setHeight] = useState(getHeight());
  const [mobileView, setMobileView] = useState(mql.matches);

  const [filteredData, setFilteredData] = useState([]);
  const itemsRef = useRef();

  useEffect(() => {
    if (!mobileView) {
      return;
    }
    const searchMobileData = () => {
      const searchColumns = columns.filter((item) => !item.disableSearch);
      const filteredRows = data.filter((item) => {
        let found = false;
        for (let column of searchColumns) {
          if (
            (item[column.originalId || column.id] + "" || "")
              .toLowerCase()
              .includes(search.toLowerCase())
          ) {
            found = true;
            break;
          }
        }
        return found;
      });
      setFilteredData(filteredRows);
      setHeight(getHeight());
      itemsRef.current.scrollToItem(0);
      itemsRef.current.resetAfterIndex(0, true);
    };

    const timeout = setTimeout(searchMobileData, 300);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, data, mobileView]);

  const Row = ({ index, style }) => (
    <TransactionCard
      style={style}
      //   onClick={() => {
      //     setSelectedItem(filteredData[index]);
      //     setOpen(true);
      //   }}
      onClick={
        handleItemClick
          ? (e) => {
              handleItemClick(filteredData[index]);
            }
          : null
      }
      key={filteredData[index].id}
      item={filteredData[index]}
    />
  );

  useEffect(() => {
    const resizeHandler = () => {
      if (mql.matches) {
        setHeight(getHeight());
        if (!mobileView) {
          setMobileView(true);
        }
      } else {
        if (mobileView) {
          setMobileView(false);
        }
      }
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileView]);

  return (
    <div style={{ marginTop: 10, width: "100%" }}>
      {mobileView ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              position: "relative",
              height: 50,
              marginBottom: 10,
            }}
          >
            <TextField
              margin="dense"
              size="small"
              style={{ position: "absolute" }}
              fullWidth
              placeholder="Search"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {refreshData && (
              <IconButton
                style={{ position: "absolute", right: 0 }}
                size="small"
                onClick={refreshData}
              >
                <RefreshIcon fontSize="large" color="primary" />
              </IconButton>
            )}
          </div>
          <div>
            {loading ? (
              <LinearProgress />
            ) : (
              <List
                ref={itemsRef}
                height={height}
                width="100%"
                itemCount={filteredData.length}
                itemSize={(index) => {
                  if (filteredData.length === 0) {
                    return 0;
                  }
                  return filteredData[index].description ? 145 : 110;
                }}
              >
                {Row}
              </List>
            )}
          </div>
        </>
      ) : (
        <CustomTableWithPage
          columns={columns}
          rows={data}
          loading={loading}
          error={null}
          filter={null}
          search={search}
          onRowClick={
            handleItemClick
              ? (row) => {
                  handleItemClick(row);
                }
              : null
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 10,
            }}
          >
            <TextField
              margin="dense"
              size="small"
              placeholder="Search"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </CustomTableWithPage>
      )}
    </div>
  );
};

export default ResponsiveDataViewer;
