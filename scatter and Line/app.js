import linechart from "./dist/linechart.js";
import scatterplot from "./dist/scatterplot.js";

d3.json("./data.json").then((data) => {
  const filteredData = data.map((e) => {
    return {
      ...e,
      date: new Date(e.date),
    };
  });
  const filteredDataScatter = filteredData.filter((d) => d.period === "month");

  scatterplot(filteredDataScatter);
  linechart(filteredData);
});
