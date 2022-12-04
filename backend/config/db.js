const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_SERVER,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "utc",
});

const DB = (function () {
  function _query(query, params, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.error("ERROR: releasing connection.");
        connection.release();
        callback(null, err);
        throw err;
      }

      connection.query(query, params, function (err, rows) {
        connection.release();
        if (!err) {
          callback(rows);
        } else {
          callback(null, err);
        }
      });

      // connection.on("error", function (err) {
      //   console.error("ERROR: releasing connection.");
      //   connection.release();
      //   callback(null, err);
      //   throw err;
      // });
    });
  }

  const _query_promise = (query, params) => {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.error("ERROR: releasing connection.", err);
          connection.release();
          reject(err);
        }

        connection.query(query, params, function (err, rows) {
          connection.release();
          if (!err) {
            resolve(rows);
          } else {
            reject(err);
          }
        });

        // connection.on("error", function (err) {
        //   console.error("ERROR: releasing connection.", err);
        //   connection.release();
        //   reject(err);
        // });
      });
    });
  };

  return {
    query: _query,
    query_promise: _query_promise,
  };
})();

module.exports = DB;
