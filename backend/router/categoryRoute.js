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

module.exports = router;
