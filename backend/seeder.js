const DB = require("./config/db");

//PUT YOUR DATA HERE
const data = [];

const loadData = async () => {
  for (let item of data) {
    const { date, category, description, amount } = item;
    const myDate = new Date(date);
    const utcDate = Date.UTC(
      myDate.getUTCFullYear(),
      myDate.getUTCMonth(),
      myDate.getUTCDate(),
      myDate.getUTCHours(),
      myDate.getUTCMinutes(),
      myDate.getUTCSeconds()
    );
    let currDate = new Date(utcDate).toISOString();
    insertDate = `${currDate.split("T")[0]} ${
      currDate.split("T")[1].split(".")[0]
    }`;
    console.log(date, insertDate);

    try {
      const data = await DB.query_promise(
        "INSERT INTO tbl_transaction (date, category, description, amount) VALUES (?,?,?,?)",
        [insertDate, category, description, amount]
      );
      console.log(data.insertId);
    } catch (error) {
      console.error(error);
    }
  }

  console.log("DATA IMPORTED");
};

loadData();
