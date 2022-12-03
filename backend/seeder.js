const DB = require("./config/db");

//PUT YOUR DATA HERE
const data = [
  {
    id: 1,
    date: "2022-04-07 12:38:20",
    category: "Savings",
    description: "Opening Balance",
    amount: 201829.65,
  },
  {
    id: 2,
    date: "2022-04-07 21:42:02",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 3,
    date: "2022-04-09 03:35:29",
    category: "Other",
    description: "-",
    amount: -1740,
  },
  {
    id: 4,
    date: "2022-04-09 05:10:13",
    category: "Food",
    description: "Milk",
    amount: -70,
  },
  {
    id: 5,
    date: "2022-04-11 18:43:15",
    category: "Other",
    description: "Cashback",
    amount: 4,
  },
  {
    id: 6,
    date: "2022-04-18 07:39:59",
    category: "Other",
    description: "For LIC from PAPA",
    amount: 2500,
  },
  {
    id: 7,
    date: "2022-04-29 07:18:34",
    category: "Salary",
    description: "Saurabh",
    amount: 51386,
  },
  {
    id: 8,
    date: "2022-04-29 08:45:38",
    category: "Salary",
    description: "TCS Q4 FY22",
    amount: 7920,
  },
  {
    id: 9,
    date: "2022-05-05 03:39:20",
    category: "Other",
    description: "-",
    amount: -5000,
  },
  {
    id: 10,
    date: "2022-05-07 03:36:39",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 11,
    date: "2022-05-14 13:55:27",
    category: "Personal",
    description: "Anamica",
    amount: -1900,
  },
  {
    id: 12,
    date: "2022-05-17 20:44:44",
    category: "Other",
    description: "For LIC from PAPA",
    amount: 3000,
  },
  {
    id: 13,
    date: "2022-05-20 10:53:26",
    category: "Housing",
    description: "Agent-Aadhar",
    amount: -700,
  },
  {
    id: 14,
    date: "2022-05-21 14:36:04",
    category: "Housing",
    description: "",
    amount: -150000,
  },
  {
    id: 15,
    date: "2022-05-22 03:11:35",
    category: "Other",
    description: "-",
    amount: -2000,
  },
  {
    id: 16,
    date: "2022-05-24 22:10:01",
    category: "Other",
    description: "-",
    amount: -1000,
  },
  {
    id: 17,
    date: "2022-05-29 23:15:01",
    category: "Other",
    description: "-",
    amount: -209.85,
  },
  {
    id: 18,
    date: "2022-05-31 04:37:34",
    category: "Salary",
    description: "Saurabh",
    amount: 58836,
  },
  {
    id: 19,
    date: "2022-05-31 18:40:32",
    category: "Medical & Healthcare",
    description: "Medi Refund",
    amount: 1074,
  },
  {
    id: 20,
    date: "2022-05-31 21:09:17",
    category: "Food",
    description: "Milk",
    amount: -150,
  },
  {
    id: 21,
    date: "2022-06-01 03:55:47",
    category: "Medical & Healthcare",
    description: "Medicine",
    amount: -270,
  },
  {
    id: 22,
    date: "2022-06-02 03:16:12",
    category: "Other",
    description: "-",
    amount: -1000,
  },
  {
    id: 23,
    date: "2022-06-02 03:35:24",
    category: "Other",
    description: "Account Validation",
    amount: 1,
  },
  {
    id: 24,
    date: "2022-06-02 08:41:09",
    category: "Other",
    description: "Account Validation",
    amount: 1,
  },
  {
    id: 25,
    date: "2022-06-02 11:07:23",
    category: "Medical & Healthcare",
    description: "Medi Refund",
    amount: 14402,
  },
  {
    id: 26,
    date: "2022-06-03 02:09:35",
    category: "Medical & Healthcare",
    description: "Medi Refund",
    amount: 1513,
  },
  {
    id: 27,
    date: "2022-06-03 13:04:33",
    category: "Other",
    description: "-",
    amount: -16000,
  },
  {
    id: 28,
    date: "2022-06-06 03:06:16",
    category: "Personal",
    description: "Movie",
    amount: -224,
  },
  {
    id: 29,
    date: "2022-06-07 12:00:14",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 30,
    date: "2022-06-08 04:45:58",
    category: "Food",
    description: "Jalaram",
    amount: -1847,
  },
  {
    id: 31,
    date: "2022-06-09 03:15:47",
    category: "Food",
    description: "Milk",
    amount: -80,
  },
  {
    id: 32,
    date: "2022-06-09 06:18:35",
    category: "Other",
    description: "-",
    amount: -1000,
  },
  {
    id: 33,
    date: "2022-06-09 10:24:30",
    category: "Other",
    description: "-",
    amount: -5000,
  },
  {
    id: 34,
    date: "2022-06-15 02:55:13",
    category: "Housing",
    description: "Loan",
    amount: 1150000,
  },
  {
    id: 35,
    date: "2022-06-15 04:37:45",
    category: "Personal",
    description: "KULDEVI",
    amount: -25000,
  },
  {
    id: 36,
    date: "2022-06-15 08:48:18",
    category: "Housing",
    description: "For Cash Withdrawal",
    amount: -50000,
  },
  {
    id: 37,
    date: "2022-06-15 09:03:55",
    category: "Housing",
    description: "For Cash Withdrawal",
    amount: -100000,
  },
  {
    id: 38,
    date: "2022-06-15 13:16:22",
    category: "Housing",
    description: "",
    amount: -450000,
  },
  {
    id: 39,
    date: "2022-06-15 14:32:43",
    category: "Housing",
    description: "",
    amount: -300000,
  },
  {
    id: 40,
    date: "2022-06-15 14:55:57",
    category: "Housing",
    description: "Furniture",
    amount: -1,
  },
  {
    id: 41,
    date: "2022-06-16 07:31:38",
    category: "Utilities",
    description: "Electric Bill",
    amount: -65.86,
  },
  {
    id: 42,
    date: "2022-06-16 11:38:51",
    category: "Housing",
    description: "Furniture",
    amount: -48000,
  },
  {
    id: 43,
    date: "2022-06-16 20:58:41",
    category: "Housing",
    description: "",
    amount: -9026,
  },
  {
    id: 44,
    date: "2022-06-18 16:33:31",
    category: "Housing",
    description: "Furniture",
    amount: -25000,
  },
  {
    id: 45,
    date: "2022-06-19 17:56:31",
    category: "Personal",
    description: "Belt",
    amount: -150,
  },
  {
    id: 46,
    date: "2022-06-22 01:16:47",
    category: "Housing",
    description: "",
    amount: -390,
  },
  {
    id: 47,
    date: "2022-06-25 20:09:21",
    category: "Food",
    description: "GREEN APPLE",
    amount: -588,
  },
  {
    id: 48,
    date: "2022-06-30 02:00:35",
    category: "Salary",
    description: "Saurabh",
    amount: 54522,
  },
  {
    id: 49,
    date: "2022-06-30 11:48:41",
    category: "Other",
    description: "Interest",
    amount: 1603,
  },
  {
    id: 50,
    date: "2022-07-01 11:30:23",
    category: "Housing",
    description: "Furniture",
    amount: -27000,
  },
  {
    id: 51,
    date: "2022-07-04 11:06:34",
    category: "Other",
    description: "-",
    amount: -11200,
  },
  {
    id: 52,
    date: "2022-07-05 02:07:46",
    category: "Other",
    description: "-",
    amount: -700,
  },
  {
    id: 53,
    date: "2022-07-05 21:20:54",
    category: "Housing",
    description: "EMI",
    amount: -21553,
  },
  {
    id: 54,
    date: "2022-07-06 00:05:01",
    category: "Housing",
    description: "Main Gate",
    amount: -5000,
  },
  {
    id: 55,
    date: "2022-07-07 21:09:07",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 56,
    date: "2022-07-09 02:12:01",
    category: "Utilities",
    description: "Mobile Recharge",
    amount: -395,
  },
  {
    id: 57,
    date: "2022-07-11 03:11:30",
    category: "Housing",
    description: "Main Gate",
    amount: -5000,
  },
  {
    id: 58,
    date: "2022-07-12 10:03:33",
    category: "Housing",
    description: "Main Gate",
    amount: -1700,
  },
  {
    id: 59,
    date: "2022-07-13 20:28:32",
    category: "Other",
    description: "For LIC from PAPA",
    amount: 2500,
  },
  {
    id: 60,
    date: "2022-07-18 10:36:44",
    category: "Housing",
    description: "Furniture",
    amount: -50000,
  },
  {
    id: 61,
    date: "2022-07-19 08:02:41",
    category: "Other",
    description: "Meghavi",
    amount: 200,
  },
  {
    id: 62,
    date: "2022-07-19 22:47:17",
    category: "Other",
    description: "Meghavi",
    amount: -200,
  },
  {
    id: 63,
    date: "2022-07-20 05:30:31",
    category: "Other",
    description: "-",
    amount: 34050,
  },
  {
    id: 64,
    date: "2022-07-29 12:11:50",
    category: "Salary",
    description: "Saurabh",
    amount: 68166,
  },
  {
    id: 65,
    date: "2022-07-29 12:44:11",
    category: "Food",
    description: "REAL PAPRIKA",
    amount: -544,
  },
  {
    id: 66,
    date: "2022-07-30 10:41:54",
    category: "Other",
    description: "-",
    amount: -1000,
  },
  {
    id: 67,
    date: "2022-08-01 06:45:12",
    category: "Housing",
    description: "Furniture",
    amount: -12500,
  },
  {
    id: 68,
    date: "2022-08-03 15:58:16",
    category: "Housing",
    description: "",
    amount: -50011,
  },
  {
    id: 69,
    date: "2022-08-03 18:05:04",
    category: "Other",
    description: "-",
    amount: -15000,
  },
  {
    id: 70,
    date: "2022-08-03 20:40:21",
    category: "Clothing",
    description: "Myntra",
    amount: -1718,
  },
  {
    id: 71,
    date: "2022-08-05 00:08:17",
    category: "Housing",
    description: "EMI",
    amount: -21553,
  },
  {
    id: 72,
    date: "2022-08-05 14:35:51",
    category: "Personal",
    description: "Laptop Repairing",
    amount: -3850,
  },
  {
    id: 73,
    date: "2022-08-06 02:10:29",
    category: "Personal",
    description: "Laptop Battery",
    amount: -1700,
  },
  {
    id: 74,
    date: "2022-08-07 22:40:34",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 75,
    date: "2022-08-12 08:16:55",
    category: "Other",
    description: "For LIC from PAPA",
    amount: 2500,
  },
  {
    id: 76,
    date: "2022-08-12 10:30:18",
    category: "Housing",
    description: "Furniture",
    amount: -6200,
  },
  {
    id: 77,
    date: "2022-08-12 18:52:36",
    category: "Personal",
    description: "Kanchan Rakhi",
    amount: -501,
  },
  {
    id: 78,
    date: "2022-08-13 19:48:55",
    category: "Personal",
    description: "Yashi Yana",
    amount: -501,
  },
  {
    id: 79,
    date: "2022-08-16 23:28:20",
    category: "Utilities",
    description: "Mobile Recharge",
    amount: -121,
  },
  {
    id: 80,
    date: "2022-08-29 07:43:33",
    category: "Other",
    description: "-",
    amount: 2500,
  },
  {
    id: 81,
    date: "2022-08-29 17:30:33",
    category: "Other",
    description: "-",
    amount: -2500,
  },
  {
    id: 82,
    date: "2022-08-30 02:20:02",
    category: "Salary",
    description: "Saurabh",
    amount: 57066,
  },
  {
    id: 83,
    date: "2022-09-01 01:11:31",
    category: "Medical & Healthcare",
    description: "Medi Refund",
    amount: 20635,
  },
  {
    id: 84,
    date: "2022-09-01 10:15:56",
    category: "Other",
    description: "Medical & Healthcare INSURANCE",
    amount: -20635,
  },
  {
    id: 85,
    date: "2022-09-02 10:12:33",
    category: "Other",
    description: "FD Interest",
    amount: 2501,
  },
  {
    id: 86,
    date: "2022-09-02 11:20:29",
    category: "Other",
    description: "FD",
    amount: 50000,
  },
  {
    id: 87,
    date: "2022-09-02 13:51:47",
    category: "Housing",
    description: "",
    amount: -150032,
  },
  {
    id: 88,
    date: "2022-09-05 23:12:58",
    category: "Housing",
    description: "EMI",
    amount: -21553,
  },
  {
    id: 89,
    date: "2022-09-07 19:08:14",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 90,
    date: "2022-09-08 07:32:09",
    category: "Other",
    description: "Yuvi Train Refund",
    amount: 4670,
  },
  {
    id: 91,
    date: "2022-09-12 16:58:51",
    category: "Other",
    description: "For LIC from PAPA",
    amount: 2500,
  },
  {
    id: 92,
    date: "2022-09-13 04:14:31",
    category: "Medical & Healthcare",
    description: "Medi Refund",
    amount: 1505,
  },
  {
    id: 93,
    date: "2022-09-15 16:15:23",
    category: "Other",
    description: "MEDICAL CLAIM",
    amount: -1505,
  },
  {
    id: 94,
    date: "2022-09-21 17:53:22",
    category: "Utilities",
    description: "HDFC Credit Card",
    amount: -4719,
  },
  {
    id: 95,
    date: "2022-09-30 12:22:20",
    category: "Salary",
    description: "Saurabh",
    amount: 57066,
  },
  {
    id: 96,
    date: "2022-09-30 18:13:01",
    category: "Other",
    description: "Interest",
    amount: 1704,
  },
  {
    id: 97,
    date: "2022-10-05 19:05:40",
    category: "Housing",
    description: "EMI",
    amount: -21553,
  },
  {
    id: 98,
    date: "2022-10-07 05:20:50",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 99,
    date: "2022-10-07 07:50:59",
    category: "Housing",
    description: "",
    amount: -50048,
  },
  {
    id: 100,
    date: "2022-10-07 14:34:08",
    category: "Other",
    description: "Move to BOB",
    amount: 30000,
  },
  {
    id: 101,
    date: "2022-10-08 15:43:56",
    category: "Food",
    description: "Milk",
    amount: -103,
  },
  {
    id: 102,
    date: "2022-10-08 22:12:29",
    category: "Food",
    description: "Bigbasket",
    amount: -1631,
  },
  {
    id: 103,
    date: "2022-10-11 10:44:40",
    category: "Other",
    description: "Cashback",
    amount: 1,
  },
  {
    id: 104,
    date: "2022-10-14 05:04:56",
    category: "Other",
    description: "Move to BOB",
    amount: 966.06,
  },
  {
    id: 105,
    date: "2022-10-14 09:00:49",
    category: "Other",
    description: "For FD",
    amount: 52500,
  },
  {
    id: 106,
    date: "2022-10-14 23:59:56",
    category: "Savings",
    description: "FD",
    amount: -170000,
  },
  {
    id: 107,
    date: "2022-10-19 07:08:08",
    category: "Other",
    description: "For LIC from PAPA",
    amount: 1500,
  },
  {
    id: 108,
    date: "2022-10-20 10:54:12",
    category: "Utilities",
    description: "HDFC Credit Card",
    amount: -2776,
  },
  {
    id: 109,
    date: "2022-10-20 11:07:05",
    category: "Other",
    description: "For LIC from PAPA",
    amount: 2776,
  },
  {
    id: 110,
    date: "2022-10-28 01:27:21",
    category: "Other",
    description: "From Rakhi",
    amount: 5000,
  },
  {
    id: 111,
    date: "2022-10-29 18:11:40",
    category: "Other",
    description: "-",
    amount: -5000,
  },
  {
    id: 112,
    date: "2022-10-31 17:14:10",
    category: "Salary",
    description: "Saurabh",
    amount: 68166,
  },
  {
    id: 113,
    date: "2022-11-04 02:48:53",
    category: "Other",
    description: "For Credit Card Pay",
    amount: -19110,
  },
  {
    id: 114,
    date: "2022-11-05 00:59:25",
    category: "Housing",
    description: "EMI",
    amount: -21553,
  },
  {
    id: 115,
    date: "2022-11-07 09:35:01",
    category: "Insurance",
    description: "LIC Shalu",
    amount: -1212,
  },
  {
    id: 116,
    date: "2022-11-14 17:41:27",
    category: "Housing",
    description: "Furniture",
    amount: -2000,
  },
];

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
