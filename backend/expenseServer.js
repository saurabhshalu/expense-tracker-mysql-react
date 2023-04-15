const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
//const cors = require("cors");

const https = require("https");
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

app.use("/api/expense", protect, checkAdmin, expenseRoute);
app.use("/api/category", protect, checkAdmin, categoryRoute);
app.use("/api/report", protect, checkAdmin, reportRoute);
app.use("/api/wallets", protect, checkAdmin, walletRoute);
app.use("/api/transactions", protect, checkAdmin, transactionRoute);
app.use("/api/query", protect, checkAdmin, queryRoute);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});


/*app.listen(
  process.env.PORT,
  console.log(`Server running on PORT: ${process.env.PORT}`)
);*/

const options = {
  key: fs.readFileSync('/etc/nginx/ssl/nginx.key'),
  cert: fs.readFileSync('/etc/nginx/ssl/nginx.crt')
}

https.createServer(options, app).listen(process.env.PORT, ()=>console.log(`Server started on port : ${process.env.PORT}`))
