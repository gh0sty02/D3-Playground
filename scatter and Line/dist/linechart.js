import {
  width,
  height,
  margin,
  getFilteredData,
  xValue,
  yValue,
  getYScale,
  defaultDate,
} from "./utils.js";

export default function (data) {
  let date = defaultDate;
  let filteredData = getFilteredData(date, data);

  const dataHolder = document.querySelector("#data-holder");

  const svg = d3
    .select("#line-chart")
    .attr("class", "line-chart")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Y Axis

  const yAxisLabel = "Users";
  const yScale = getYScale(data);
  const yAxis = d3.axisLeft(yScale).tickSize(-width).tickPadding(10);
  g.append("g").call(yAxis).selectAll("text").attr("font-size", "12px");

  g.append("text")
    .attr("class", "axis-label")
    .attr("y", -70)
    .attr("x", -height / 2)
    .text(yAxisLabel)
    .attr("class", "yLabel");

  // X Axis
  const xAxisLabel = "Time";
  const xScale = d3.scaleTime().range([0, width]).nice();
  const xAxis = d3.axisBottom(xScale).tickSize(-height).tickPadding(10);
  g.append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${height})`)
    .selectAll("text")
    .attr("font-size", "12px");

  g.append("text")
    .attr("class", "axis-label")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .text(xAxisLabel)
    .attr("class", "xLabel");

  // line generator to generate lines
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

  d3.interval(() => {
    const extractedDate = dataHolder.getAttribute("data-date");
    date = extractedDate ? extractedDate : defaultDate;
    filteredData = getFilteredData(date, data);
    xScale.domain(d3.extent(filteredData, xValue));
    yScale.domain(d3.extent(filteredData, yValue));
  }, 50);

  d3.interval(() => {
    render(filteredData, g, lineGenerator);
  }, 100);
}

const render = (data, g, lineGenerator) => {
  const line = g.selectAll(".line-path").data(data);

  line.exit().remove();

  // Updata the line
  line
    .enter()
    .append("path")
    .attr("class", "line-path")
    .merge(line)
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "rgb(255, 20, 12)")
    .attr("stroke-width", 2.5);
};
