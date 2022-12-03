const DB = require("../config/db");

const router = require("express").Router();

router
  .route("/")
  .post(async (req, res) => {
    try {
      const { date, category, description, amount } = req.body;
      if (!category && !description) {
        return res.status(400).json({
          success: false,
          message: "Category or Description is required.",
        });
      }
      const mydate = date ? new Date(date) : new Date();
      const mydateString = mydate.toISOString().split("T");
      const data = await DB.query_promise(
        "INSERT INTO tbl_transaction (date, category, description, amount) VALUES (?,?,?,?)",
        [
          `${mydateString[0]} ${mydateString[1].replace("Z", "")}`,
          category,
          description,
          amount,
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
        `SELECT * ,(
            SELECT SUM(T2.amount)  
             FROM tbl_transaction AS T2
                   WHERE T2.date <= T1.date
            ) AS RunningTotal
            FROM tbl_transaction AS T1 ORDER BY date DESC`
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
  })
  .put(async (req, res) => {
    try {
      const { id, amount, description, category, date } = req.body;

      if (!id || !amount || (!description && !category)) {
        return res
          .status(400)
          .json({ success: false, message: "Please send correct data." });
      }

      let query = `UPDATE tbl_transaction SET amount=?, description=?, category=?`;
      const values = [amount, description, category];

      if (date) {
        query += `, date=?`;
        const mydate = date ? new Date(date) : new Date();
        const mydateString = mydate.toISOString().split("T");
        values.push(`${mydateString[0]} ${mydateString[1].replace("Z", "")}`);
      }

      query += ` WHERE id=?`;
      values.push(id);
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
      const { id } = req.body;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Please send proper request." });
      }
      const data = await DB.query_promise(
        "DELETE FROM tbl_transaction WHERE id=?",
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

router.get("/report", async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
  try {
    const data = await DB.query_promise(
      "SELECT * FROM tbl_transaction WHERE category=?",
      [category]
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
