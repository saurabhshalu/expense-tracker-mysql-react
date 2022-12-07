const DB = require("../config/db");

const router = require("express").Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const data = await DB.query_promise("SELECT * FROM wallets");
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error.sqlMessage ||
          error.message ||
          "Something went wrong, please contact admin.",
      });
    }
  })
  .post(async (req, res) => {
    let { name, balance = 0, type = "debit" } = req.body;
    if (!["credit", "debit"].includes(type) || !name || !balance) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request." });
    }

    if (type === "credit") {
      balance = 0; //CREDIT TYPE SHOULD HAVE BALANCE 0;
    }

    try {
      const data = await DB.query_promise(
        "INSERT INTO wallets(name, balance, type) VALUES(?,?,?)",
        [name, balance, type]
      );
      res.status(200).json({ success: true, data });
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
  .delete(async (req, res) => {
    try {
      const data = await DB.query_promise("DELETE FROM wallets WHERE id=?", [
        req.params.id,
      ]);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error.sqlMessage ||
          error.message ||
          "Something went wrong, please contact admin.",
      });
    }
  })
  .put(async (req, res) => {
    try {
      const { name, status } = req.body;

      let query = `UPDATE wallets SET active=?`;
      const values = [status];

      if (name) {
        query += ` ,name=?`;
        values.push(name);
      }

      query += ` WHERE id=?`;
      values.push(req.params.id);

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
  });

router.get("/:id/history", async (req, res) => {
  try {
    const { start, end, type, offset = -330 } = req.query;

    let query = "SELECT * FROM transactions WHERE wallet_id=?";
    const values = [req.params.id];

    if (type) {
      if (type === "Expense") {
        query += ` AND amount < ?`;
        values.push(0);
      } else if (type === "Income") {
        query += ` AND amount >= ?`;
        values.push(0);
      }
    }

    if (start) {
      const startDate = new Date(start);
      startDate.setUTCHours(0, 0 + +offset, 0, 0);
      const startString = startDate.toISOString().split("T");

      query += ` AND date >= ?`;
      values.push(`${startString[0]} ${startString[1].replace("Z", "")}`);
    }
    if (end) {
      const endDate = new Date(end);
      endDate.setUTCHours(23, 59 + +offset, 59, 999);
      const endString = endDate.toISOString().split("T");

      query += ` AND date <= ?`;
      values.push(`${endString[0]} ${endString[1].replace("Z", "")}`);
    }

    query += " ORDER BY date DESC";

    const data = await DB.query_promise(query, values);
    res.status(200).json({ success: true, data });
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

router.get("/balance", async (req, res) => {
  try {
    const walletBalanceListFromTransactions = await DB.query_promise(
      "SELECT wallet_id, SUM(amount) as balance FROM transactions GROUP BY wallet_id"
    );
    const walletList = await DB.query_promise(
      "SELECT * FROM wallets WHERE active=true"
    );

    const data = walletList.map((item) => ({
      ...item,
      balance:
        item.balance +
        (walletBalanceListFromTransactions.find((i) => i.wallet_id === item.id)
          ?.balance || 0),
    }));
    res.status(200).json({
      success: true,
      data,
    });
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

module.exports = router;
