const margin = {
  left: 150,
  right: 20,
  top: 20,
  bottom: 150,
};

// counter to keep track of the year
let counter = 0;

const height = 400;
const width = 600;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// scales
const x = d3.scaleLog().range([0, width]).domain([142, 150000]);
const y = d3.scaleLinear().range([height, 0]).domain([0, 90]);
const continentColor = d3.scaleOrdinal(d3.schemePastel1);

// area to calculate radius for each circle
const area = d3
  .scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000]);

// x axis
const xAxisCall = d3
  .axisBottom(x)
  .tickValues([0, 400, 4000, 40000])
  .tickFormat(d3.format("$"));

const xAxisGroup = g
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .attr("class", "x axis")
  .call(xAxisCall);

// y axis
const yAxisCall = d3.axisLeft(y);

const yAxisGroup = g.append("g").call(yAxisCall);

// labels

const xLabel = g
  .append("text")
  .text("GDP Per Capita")
  .attr("font-size", "20px")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("text-anchor", "middle");

const yLabel = g
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -40)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Life Expectancy (Years)");

const timeLabel = g
  .append("text")
  .attr("font-size", "40px")
  .attr("text-anchor", "middle")
  .text("1800")
  .attr("y", height - 10)
  .attr("x", width - 40);

// creating and updating the scatter plot
d3.json("/data/data.json").then((data) => {
  // filtering to remove countries with null income or life expectancy and parsing the strings into number
  const filteredData = data.map((year) => {
    return year["countries"]
      .filter((country) => {
        const dataExists = country.income && country.life_exp;
        return dataExists;
      })
      .map((country) => {
        country.income = Number(country.income);
        country.life_exp = Number(country.life_exp);
        return country;
      });
  });

  console.log(filteredData);
  // updating the chart
  d3.interval(function () {
    counter = counter < 214 ? counter + 1 : 0;
    update(filteredData[counter]);
  }, 100);

  update(filteredData[0]);
});

const update = (data) => {
  const t = d3.transition().duration(100);

  // joining new data
  const circles = g.selectAll("circle").data(data, (data) => data.country);

  // removing old elements
  circles.exit().remove();

  // updating old elements and adding new elements
  circles
    .enter()
    .append("circle")
    .attr("fill", (d) => continentColor(d.continent))
    .merge(circles)
    .transition(t)
    .attr("cx", (d) => {
      return x(d.income);
    })
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => Math.sqrt(area(d.population / Math.PI)));

  // updating the year counter
  timeLabel.text(String(counter + 1800));
};
