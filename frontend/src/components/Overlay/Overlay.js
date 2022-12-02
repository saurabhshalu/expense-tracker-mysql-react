import { CircularProgress } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
const renderContent = () => {
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        color: "white",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>,
    document.querySelector("#overlay")
  );
};

const Overlay = ({ open }) => {
  return open ? renderContent() : null;
};

export default Overlay;
