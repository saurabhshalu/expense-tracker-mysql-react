import React from "react";
import { formatDate } from "../../helper";
import styles from "./TransactionCard.module.css";

const TransactionCard = ({ item, style, onClick }) => {
  return (
    <div
      onClick={onClick ? onClick : () => {}}
      style={{
        ...style,
        cursor: onClick ? "pointer" : "default",
        pointerEvents: onClick ? "auto" : "none",
      }}
    >
      <div className={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: 30,
            alignItems: "center",
          }}
        >
          <div>{formatDate(item.date)}</div>
          <div
            style={{
              background: "black",
              padding: "2px 10px",
              color: "white",
              borderRadius: 10,
            }}
          >
            {item.category}
          </div>
        </div>
        <hr className="hrStyle" />
        {item.description && (
          <>
            <div
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {item.description}
            </div>
            <hr className="hrStyle hrStyleDesktop" />
          </>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 5,
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                color: item.amount > 0 ? "green" : "red",
              }}
            >
              {item.amount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </div>
          </div>

          <div style={{ color: "gray", fontSize: 12 }}>{item.wallet_name}</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
