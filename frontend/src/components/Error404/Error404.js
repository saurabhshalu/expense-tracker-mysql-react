import React from "react";
import styles from "./Error404.module.css";

const Error404 = ({ error }) => {
  return (
    <div className={styles.container}>
      <img style={{ width: "50%" }} src="/404.svg" alt="error" />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Error404;
