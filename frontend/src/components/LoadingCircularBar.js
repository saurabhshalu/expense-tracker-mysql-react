import { CircularProgress } from "@mui/material";
import React from "react";

const LoadingCircularBar = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress style={{ width: 100, height: 100 }} />
    </div>
  );
};

export default LoadingCircularBar;
