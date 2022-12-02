const getDaysInMonth = (m, y) => {
  m += 1;
  return m === 2
    ? y & 3 || (!(y % 25) && y & 15)
      ? 28
      : 29
    : 30 + ((m + (m >> 3)) & 1);
};

const getFirstDateOfGivenMonth = (date) => {
  const givenDate = new Date(date);
  return new Date(givenDate.getFullYear(), givenDate.getMonth(), 1);
};

const getLastDateOfGivenMonth = (date) => {
  const givenDate = new Date(date);
  const month = givenDate.getMonth();
  const year = givenDate.getFullYear();
  return new Date(year, month, getDaysInMonth(month, year));
};
