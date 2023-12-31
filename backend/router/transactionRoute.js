const DB = require("../config/db");

const router = require("express").Router();

router
  .route("/")
  .post(async (req, res) => {
    try {
      const { date, category, description, amount, wallet_id } = req.body;
      if (!category || !wallet_id || !amount) {
        return res.status(400).json({
          success: false,
          message: "Invalid Request.",
        });
      }
      const mydate = date ? new Date(date) : new Date();
      const mydateString = mydate.toISOString().split("T");
      const data = await DB.query_promise(
        "INSERT INTO transactions (date, category, description, amount, wallet_id,email) VALUES (?,?,?,?,?,?)",
        [
          `${mydateString[0]} ${mydateString[1].replace("Z", "")}`,
          category,
          description,
          amount,
          wallet_id,
          req.user.email,
        ]
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
  })
  .get(async (_, res) => {
    try {
      const rows = await DB.query_promise(
        `select a.id, a.date, a.category, a.description, a.amount, a.wallet_id, b.name as wallet_name from transactions a INNER JOIN wallets b ON a.wallet_id = b.id and a.email = b.email WHERE a.email=? ORDER BY a.date DESC`,
        [req.user.email]
      );
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error.sqlMessage ||
          error.message ||
          "Something went wrong, please contact admin.",
      });
    }
  });

router
  .route("/:id")
  .put(async (req, res) => {
    try {
      const { amount, description, category, date, wallet_id } = req.body;

      if (!amount || !category || !wallet_id) {
        return res
          .status(400)
          .json({ success: false, message: "Please send correct data." });
      }

      let query = `UPDATE transactions SET amount=?, description=?, category=?, wallet_id=?`;
      const values = [amount, description, category, wallet_id];

      if (date) {
        query += `, date=?`;
        const mydate = date ? new Date(date) : new Date();
        const mydateString = mydate.toISOString().split("T");
        values.push(`${mydateString[0]} ${mydateString[1].replace("Z", "")}`);
      }

      query += ` WHERE id=? and email=?`;
      values.push(req.params.id);
      values.push(req.user.email);
      const data = await DB.query_promise(query, values);
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
  })
  .delete(async (req, res) => {
    try {
      const data = await DB.query_promise(
        "DELETE FROM transactions WHERE id=? and email=?",
        [req.params.id, req.user.email]
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

router.get("/groupByCategory", async (req, res) => {
  try {
    const { start, end, offset = -330 } = req.query;
    if (!start || !end) {
      return res
        .status(400)
        .json({ success: false, message: "Please send correct data." });
    }
    let sqlQuery = `SELECT category, sum(amount) as total FROM transactions`;
    const values = [];

    const startDate = new Date(start);
    startDate.setUTCHours(0, 0 + +offset, 0, 0);
    const startString = startDate.toISOString().split("T");

    const endDate = new Date(end);
    endDate.setUTCHours(23, 59 + +offset, 59, 999);
    const endString = endDate.toISOString().split("T");

    sqlQuery += ` WHERE email=? AND date >= ? AND date <= ?`;
    values.push(req.user.email);
    values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
    values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);

    sqlQuery += ` GROUP BY category, SIGN(amount)`;
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

module.exports = router;
