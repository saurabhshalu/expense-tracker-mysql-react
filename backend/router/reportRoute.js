const DB = require("../config/db");

const router = require("express").Router();

router.get("/overview", async (req, res) => {
  try {
    const { start, end, offset = -330 } = req.query;
    let sqlQuery = `SELECT category, sum(amount) as total FROM tbl_transaction`;
    const values = [];

    const startDate = new Date(start);
    startDate.setUTCHours(0, 0 + +offset, 0, 0);
    const startString = startDate.toISOString().split("T");

    const endDate = new Date(end);
    endDate.setUTCHours(23, 59 + +offset, 59, 999);
    const endString = endDate.toISOString().split("T");

    sqlQuery += ` WHERE date >= ? AND date <= ?`;
    values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
    values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);

    sqlQuery += ` GROUP BY category, SIGN(amount)`;
    const data = await DB.query_promise(sqlQuery, values);

    let closingBalanceQuery = `SELECT sum(amount) as total FROM tbl_transaction WHERE date < ?`;

    const closingBalance = await DB.query_promise(closingBalanceQuery, [
      `${startString[0]} ${startString[1].replace("Z", "")}`,
    ]);

    let afterLastDateBalanceQuery = `SELECT sum(amount) as total FROM tbl_transaction WHERE date > ?`;

    const afterLastDateBalance = await DB.query_promise(
      afterLastDateBalanceQuery,
      [`${endString[0]} ${endString[1].replace("Z", "")}`]
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
  const { start, end, category, type, offset = -330 } = req.query;

  let sqlQuery = `SELECT * FROM tbl_transaction WHERE`;
  const values = [];
  if (category) {
    sqlQuery += ` category = ?`;
    values.push(category);
  }
  if (start) {
    const startDate = new Date(start);
    startDate.setUTCHours(0, 0 + +offset, 0, 0);
    const startString = startDate.toISOString().split("T");

    sqlQuery += `${values.length > 0 ? " AND" : ""} date >= ?`;
    values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
  }
  if (end) {
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59 + +offset, 59, 999);
    const endString = endDate.toISOString().split("T");

    sqlQuery += `${values.length > 0 ? " AND" : ""} date <= ?`;
    values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);
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
