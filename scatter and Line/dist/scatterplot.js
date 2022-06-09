import {
  height,
  width,
  margin,
  formatTime,
  xValue,
  yValue,
  getYScale,
  getArea,
} from "./utils.js";

export default function (data) {
  const dataHolder = document.querySelector("#data-holder");
  const area = getArea(data);

  // creating tooltip
  const tip = d3
    .tip()
    .attr("class", "d3-tip")
    .html((Event, d) => {
      console.log(d);
      let text = `<strong>Users:</strong> <span style='color:red;text-transform:capitalize'>${d3.format(
        ".2s"
      )(d.users)}</span><br>`;
      text += `<strong>Month:</strong> <span style='color:red;text-transform:capitalize'>${formatTime(
        new Date(d.date)
      )}</span><br>`;

      return text;
    });

  const svg = d3
    .select("#chart-area")
    .attr("class", "scatter")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // calling the tooltip with the visualization context
  g.call(tip);

  // X Axis

  const xScale = d3.scaleTime().range([0, width]).nice();
  const xAxis = d3.axisBottom(xScale).tickPadding(10);
  const xAxisLabel = "Months";
  xScale.domain([new Date("12/05/2019"), d3.max(data, xValue)]);

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

  // Y Axis

  const yScale = getYScale(data);
  const yAxis = d3.axisLeft(yScale).tickPadding(10);
  const yAxisLabel = "Users";
  g.append("g").call(yAxis).selectAll("text").attr("font-size", "12px");
  g.append("text")
    .attr("class", "axis-label")
    .attr("y", -70)
    .attr("x", -height / 2)
    .text(yAxisLabel)
    .attr("class", "yLabel");

  // appending circles
  const circles = g.selectAll("circle").data(data);

  circles
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("r", (d) => Math.sqrt(area(d.users / Math.PI)))
    .attr("class", (d) => formatTime(d.date))
    .attr("fill", "rgba(255, 20, 12, 0.5)")
    .attr("data-date", (d) => d.date.toLocaleString())
    .on("mouseenter.tip", tip.show)
    .on("mouseleave.tip", tip.hide)
    .on("mouseover", (d) => {
      dataHolder.setAttribute("data-date", d.target.__data__.date);
      d.target.style.fill = "#777";
    })
    .on("mouseout", (d) => {
      d.target.style.fill = "rgba(255, 20, 12, 0.5)";
    })
    .selectAll("circle")
    .attr("fill", "rgba(255, 20, 12, 0.5)");
}
