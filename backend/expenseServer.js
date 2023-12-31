const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
//const cors = require("cors");

// const https = require("https");
const fs = require("fs");

const expenseRoute = require("./router/expenseRoute");
const categoryRoute = require("./router/categoryRoute");
const reportRoute = require("./router/reportRoute");
const walletRoute = require("./router/walletRoute");
const transactionRoute = require("./router/transactionRoute");
const queryRoute = require("./router/queryRoute");

const { protect, checkAdmin } = require("./middleware/authMiddleware");
__dirname = path.resolve();

dotenv.config();

const app = express();

//app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend", "build")));
app.use(express.static("public"));

app.use("/api/expense", protect, expenseRoute);
app.use("/api/category", protect, categoryRoute);
app.use("/api/report", protect, reportRoute);
app.use("/api/wallets", protect, walletRoute);
app.use("/api/transactions", protect, transactionRoute);
app.use("/api/query", protect, queryRoute);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(
  process.env.PORT,
  console.log(`Server running on PORT: ${process.env.PORT}`)
);

// const options = {
//   key: fs.readFileSync('/etc/nginx/ssl/private.key'),
//   cert: fs.readFileSync('/etc/nginx/ssl/certificate.crt')
// }

// https.createServer(options, app).listen(process.env.PORT, ()=>console.log(`Server started on port : ${process.env.PORT}`))
