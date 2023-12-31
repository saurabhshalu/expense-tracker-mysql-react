const DB = require("../config/db");

const router = require("express").Router();

router.get("/advance", async (req, res) => {
  try {
    const {
      start,
      end,
      offset = -330,
      wallet_id = 0,
      category,
      type,
    } = req.query;

    let sqlQuery = `SELECT a.id, a.date, a.category, a.description, a.amount, a.wallet_id, b.name as wallet_name FROM transactions a INNER JOIN wallets b ON a.wallet_id = b.id AND a.email = b.email WHERE a.email=? AND`;
    const values = [req.user.email];

    const startDate = new Date(start);
    startDate.setUTCHours(0, 0 + +offset, 0, 0);
    const startString = startDate.toISOString().split("T");

    const endDate = new Date(end);
    endDate.setUTCHours(23, 59 + +offset, 59, 999);
    const endString = endDate.toISOString().split("T");

    sqlQuery += ` a.date >= ? AND a.date <= ?`;
    values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
    values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);

    if (wallet_id > 0) {
      sqlQuery += ` AND a.wallet_id = ?`;
      values.push(wallet_id);
    }

    if (type === "credit") {
      sqlQuery += ` AND a.amount >= 0`;
    } else if (type === "debit") {
      sqlQuery += ` AND a.amount < 0`;
    }

    if (category) {
      sqlQuery += ` AND a.category = ?`;
      values.push(category);
    }

    sqlQuery += ` ORDER BY a.date DESC`;
    const data = await DB.query_promise(sqlQuery, values);

    res.status(200).json({
      success: true,
      data,
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
router.get("/expenseincomebycategory", async (req, res) => {
  try {
    const { start, end, offset = -330, wallet_id = 0, type } = req.query;
    let sqlQuery = `SELECT category, sum(amount) as total FROM transactions WHERE email=? AND`;
    const values = [req.user.email];

    const startDate = new Date(start);
    startDate.setUTCHours(0, 0 + +offset, 0, 0);
    const startString = startDate.toISOString().split("T");

    const endDate = new Date(end);
    endDate.setUTCHours(23, 59 + +offset, 59, 999);
    const endString = endDate.toISOString().split("T");

    sqlQuery += ` date >= ? AND date <= ?`;
    values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
    values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);

    if (wallet_id > 0) {
      sqlQuery += ` AND wallet_id = ?`;
      values.push(wallet_id);
    }

    if (type === "credit") {
      sqlQuery += ` AND amount >= 0`;
    } else if (type === "debit") {
      sqlQuery += ` AND amount < 0`;
    }

    sqlQuery += ` GROUP BY category`;
    const data = await DB.query_promise(sqlQuery, values);

    res.status(200).json({
      success: true,
      data,
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
router.get("/incomevsexpense", async (req, res) => {
  try {
    const { start, end, offset = -330, wallet_id = 0 } = req.query;
    let sqlQuery = `SELECT sum(amount) as total FROM transactions WHERE email=?`;
    const values = [req.user.email];

    const startDate = new Date(start);
    startDate.setUTCHours(0, 0 + +offset, 0, 0);
    const startString = startDate.toISOString().split("T");

    const endDate = new Date(end);
    endDate.setUTCHours(23, 59 + +offset, 59, 999);
    const endString = endDate.toISOString().split("T");

    sqlQuery += ` AND date >= ? AND date <= ?`;
    values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
    values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);

    if (wallet_id > 0) {
      sqlQuery += ` AND wallet_id = ?`;
      values.push(wallet_id);
    }

    sqlQuery += ` GROUP BY SIGN(amount)`;
    const data = await DB.query_promise(sqlQuery, values);

    res.status(200).json({
      success: true,
      data,
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
// router.get("/dailyexpensebetweendates", async (req, res) => {
//   try {
//     const { start, end, offset = -330 } = req.query;

//     const minutes = Math.abs(offset) % 60;
//     const hours = (Math.abs(offset) - minutes) / 60;

//     let OFFSET_STRING = `${offset > 0 ? "-" : "+"}${String(hours).padStart(
//       2,
//       "0"
//     )}:${String(minutes).padStart(2, "0")}`;

//     let sqlQuery = `SELECT DATE(CONVERT_TZ(date, '+00:00', '${OFFSET_STRING}')) as date, sum(amount) as total FROM transactions WHERE amount<0`;
//     const values = [];

//     const startDate = new Date(start);
//     startDate.setUTCHours(0, 0 + +offset, 0, 0);
//     const startString = startDate.toISOString().split("T");

//     const endDate = new Date(end);
//     endDate.setUTCHours(23, 59 + +offset, 59, 999);
//     const endString = endDate.toISOString().split("T");

//     sqlQuery += ` AND date >= ? AND date <= ?`;
//     values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
//     values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);

//     sqlQuery += ` GROUP BY DATE(CONVERT_TZ(date, '+00:00', '${OFFSET_STRING}'))`;
//     const data = await DB.query_promise(sqlQuery, values);

//     res.status(200).json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({
//       success: false,
//       message:
//         error.sqlMessage ||
//         error.message ||
//         "Something went wrong, please contact admin.",
//     });
//   }
// });

module.exports = router;
