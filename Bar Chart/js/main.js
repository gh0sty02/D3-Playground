const margin = {
  top: 20,
  bottom: 150,
  left: 100,
  right: 0,
};
let flag = true;

// total dimensions of svg
const height = 500 - margin.top - margin.bottom;
const width = 700 - margin.left - margin.right;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right);

// scales
const x = d3.scaleBand().range([0, width]).padding(0.1);
const y = d3.scaleLinear().range([height, 0]);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.right})`);

// labels
const yLabel = g
  .append("text")
  .text("Revenue")
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .attr("x", -160)
  .attr("y", -60)
  .attr("font-size", "20px");

const xLabel = g
  .append("text")
  .text("Month")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .attr("font-size", "20px");

const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
const yAxisGroup = g.append("g");

d3.json("/data/revenues.json").then((data) => {
  data.forEach((d) => {
    d.revenue = Number(d.revenue);
    d.profit = Number(d.profit);
  });

  d3.interval(function () {
    update(data);
    flag = !flag;
  }, 1000);
  update(data);
});

const update = (data) => {
  let values = flag ? "revenue" : "profit";
  x.domain(data.map((d) => d.month));
  y.domain([
    0,
    d3.max(data, (d) => {
      return d[values];
    }),
  ]);

  const xAxisCall = d3.axisBottom(x);
  const yAxisCall = d3.axisLeft(y).tickFormat((d) => `$${d}`);

  xAxisGroup
    .transition(d3.transition().duration(700))
    .call(xAxisCall)
    .selectAll("text")
    .attr("font-size", "14px");
  yAxisGroup.transition(d3.transition().duration(700)).call(yAxisCall);

  yLabel.text(values);

  // add new elements i.e data
  const rects = g.selectAll("rect").data(data);

  // remove old elements
  rects
    .exit()
    .attr("fill", "red")
    .transition(d3.transition().duration(700))
    .attr("y", y(0))
    .attr("height", (d) => 0)
    .remove();

  // rects
  //   .transition(d3.transition().duration(700))
  //   .attr("x", (d) => x(d.month))
  //   .attr("y", (d) => y(d[values]))
  //   .attr("height", (d) => height - y(d[values]))
  //   .attr("width", x.bandwidth);

  // rects
  //   .enter()
  //   .append("rect")
  //   .attr("y", (d) => y(0))
  //   .attr("x", (d) => x(d.month))
  //   .attr("width", x.bandwidth)
  //   .attr("height", (d) => 0)
  //   .attr("fill", "grey")
  //   .transition(d3.transition().duration(700))
  //   .attr("y", (d) => y(d[values]))
  //   .attr("height", (d) => height - y(d[values]));

  rects
    .enter()
    .append("rect")
    .attr("y", (d) => y(0))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", (d) => 0)
    .attr("fill", "grey")
    .merge(rects)
    .transition(d3.transition().duration(700))
    .attr("y", (d) => y(d[values]))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", (d) => height - y(d[values]));

  console.log(rects);
};
