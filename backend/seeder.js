const DB = require("./config/db");

//PUT YOUR DATA HERE
const data = [];

const loadData = async () => {
  for (let item of data) {
    const { date, category, description, amount } = item;
    try {
      const data = await DB.query_promise(
        "INSERT INTO tbl_transaction (date, category, description, amount) VALUES (?,?,?,?)",
        [date, category, description, amount]
      );
      console.log(data.insertId);
    } catch (error) {
      console.error(error);
    }
  }

  console.log("DATA IMPORTED");
};

loadData();
