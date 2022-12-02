import React from "react";

const BalanceCard = ({ style, title, amount, msg }) => {
  return (
    <div className="threeContainer">
      <div className="threeTitle">{title}</div>
      <div className="threeAmount" style={{ ...style }}>
        {(amount || 0).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          style: "currency",
          currency: "INR",
        })}
      </div>
      <div className="threeDate">{msg}</div>
    </div>
  );
};

export default BalanceCard;
