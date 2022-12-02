const DB = require("../config/db");

const router = require("express").Router();

router.get("/overview", async (req, res) => {
  try {
    const { start, end } = req.query;
    let sqlQuery = `SELECT category, sum(amount) as total FROM tbl_transaction`;
    const values = [];

    if (start && end) {
      sqlQuery += ` WHERE STR_TO_DATE(date,'%Y-%m-%d') >= ? AND STR_TO_DATE(date,'%Y-%m-%d') <= ?`;
      values.push(start);
      values.push(end);
    }

    sqlQuery += ` GROUP BY category, SIGN(amount)`;
    const data = await DB.query_promise(sqlQuery, values);

    let closingBalanceQuery = `SELECT sum(amount) as total FROM tbl_transaction WHERE STR_TO_DATE(date, '%Y-%m-%d') <= ?`;
    const closingBalanceDate = new Date(start);
    closingBalanceDate.setDate(closingBalanceDate.getDate() - 1);

    const closingBalance = await DB.query_promise(closingBalanceQuery, [
      closingBalanceDate.toISOString().split("T")[0],
    ]);

    let afterLastDateBalanceQuery = `SELECT sum(amount) as total FROM tbl_transaction WHERE STR_TO_DATE(date, '%Y-%m-%d') >= ?`;
    const lastDate = new Date(end);

    lastDate.setDate(lastDate.getDate() + 1);

    const afterLastDateBalance = await DB.query_promise(
      afterLastDateBalanceQuery,
      [lastDate.toISOString().split("T")[0]]
    );

    res.status(200).json({
      success: true,
      data: { items: data, afterLastDateBalance, closingBalance },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Something went wrong, please contact admin.",
    });
  }
});

router.get("/details", async (req, res) => {
  const { start, end, category, type } = req.query;

  let sqlQuery = `SELECT * FROM tbl_transaction WHERE`;
  const values = [];
  if (category) {
    sqlQuery += ` category = ?`;
    values.push(category);
  }
  if (start) {
    sqlQuery += `${
      values.length > 0 ? " AND" : ""
    } STR_TO_DATE(date,'%Y-%m-%d') >= ?`;
    values.push(start);
  }
  if (end) {
    sqlQuery += `${
      values.length > 0 ? " AND" : ""
    } STR_TO_DATE(date,'%Y-%m-%d') <= ?`;
    values.push(end);
  }
  if (type) {
    if (type === "Expense") {
      sqlQuery += `${values.length > 0 ? " AND" : ""} amount < ?`;
      values.push(0);
    } else if (type === "Income") {
      sqlQuery += `${values.length > 0 ? " AND" : ""} amount >= ?`;
      values.push(0);
    }
  }
  if (values.length === 0) {
    sqlQuery += ` 1=1`;
  }
  sqlQuery += ` ORDER BY date DESC`;
  try {
    const data = await DB.query_promise(sqlQuery, values);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Something went wrong, please contact admin.",
    });
  }
});

router.get("/category/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
  try {
    const data = await DB.query_promise(
      "SELECT * FROM tbl_transaction WHERE category=?",
      [id]
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message:
        error.sqlMessage ||
        error.message ||
        "Something went wrong, please contact admin.",
    });
  }
});

module.exports = router;
