export const formatDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  //return date.toDateString();
  return date.toLocaleString("default", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const YYYYMMDD = (value) => {
  if (!value) {
    return null;
  }
  let d = new Date(value),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const formatDateTime = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return date.toLocaleString("default", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
};

export const getDateWithCurrentTime = (dateString = "") => {
  const values = dateString.split("-");
  const date = new Date();
  return new Date(
    +values[0],
    +values[1] - 1,
    +values[2],
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
};

const getDaysInMonth = (m, y) => {
  m += 1;
  return m === 2
    ? y & 3 || (!(y % 25) && y & 15)
      ? 28
      : 29
    : 30 + ((m + (m >> 3)) & 1);
};

export const getFirstDateOfGivenMonth = (date) => {
  const givenDate = new Date(date);
  return new Date(givenDate.getFullYear(), givenDate.getMonth(), 1);
};

export const getLastDateOfGivenMonth = (date) => {
  const givenDate = new Date(date);
  const month = givenDate.getMonth();
  const year = givenDate.getFullYear();
  return new Date(year, month, getDaysInMonth(month, year));
};
