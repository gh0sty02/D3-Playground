export const width = 650;
export const height = 300;

export const margin = {
  top: 15,
  left: 150,
  right: 15,
  bottom: 150,
};

export const formatTime = d3.timeFormat("%B, %Y");

export const getFilteredData = (date, data) => {
  const d1 = formatTime(new Date(date));

  return data.filter((d) => {
    const d2 = formatTime(new Date(d.date));
    return d1 === d2 && d.period === "week";
  });
};

export const xValue = (d) => d.date;
export const yValue = (d) => d.users;

export const getYScale = (filteredData) =>
  d3
    .scaleLinear()
    .domain(d3.extent(filteredData, yValue))
    .range([height, 0])
    .nice();

export const defaultDate = new Date("01/01/2020, 05:30:00");

export const getArea = (data) =>
  d3
    .scaleLog()
    .range([130 * Math.PI, 150 * Math.PI])
    .domain(d3.extent(data, (d) => d.users));
