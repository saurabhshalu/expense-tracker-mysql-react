const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const expenseRoute = require("./router/expenseRoute");
const categoryRoute = require("./router/categoryRoute");
const reportRoute = require("./router/reportRoute");
const walletRoute = require("./router/walletRoute");
const transactionRoute = require("./router/transactionRoute");

const { protect, checkAdmin } = require("./middleware/authMiddleware");
__dirname = path.resolve();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend", "build")));
app.use(express.static("public"));

app.use("/api/expense", protect, checkAdmin, expenseRoute);
app.use("/api/category", categoryRoute);
app.use("/api/report", protect, checkAdmin, reportRoute);
app.use("/api/wallets", walletRoute);
app.use("/api/transactions", transactionRoute);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(
  process.env.PORT,
  console.log(`Server running on PORT: ${process.env.PORT}`)
);
