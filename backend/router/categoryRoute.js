const DB = require("../config/db");

const router = require("express").Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const data = await DB.query_promise(
        "SELECT * FROM tbl_category ORDER BY name"
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
  })
  .post(async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request." });
    }
    try {
      const data = await DB.query_promise(
        "INSERT INTO tbl_category VALUES(?)",
        [name]
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

router.route("/:name").delete(async (req, res) => {
  try {
    const data = await DB.query_promise(
      "DELETE FROM tbl_category WHERE name=?",
      [req.params.name]
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

router.get("/:name/history", async (req, res) => {
  try {
    const { start, end, type, offset = -330 } = req.query;

    let query = "SELECT * FROM transactions WHERE category=?";
    const values = [req.params.name];

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

module.exports = router;
