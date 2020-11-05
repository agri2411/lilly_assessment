
const margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = 750 - margin.left - margin.right,
  height = 370 - margin.top - margin.bottom;

// Parse the date / time
const parseDate = d3.time.format("%m/%d/%Y").parse;
const formatDate = d3.time.format("%b %d");
// Set the ranges
const x = d3.time.scale().range([0, width]);
const y = d3.scale.linear().range([height, 0]);

// Define the axes
const xAxis = d3.svg.axis().scale(x)
  .orient("bottom")
  .ticks(10)
  .tickFormat(d3.time.format("%b %d"))
  .outerTickSize(0)
  .tickPadding(10);

const yAxis = d3.svg.axis().scale(y)
  .orient("left").ticks(10);

// Define the line
const valueline = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.close); });

d3.select('#lineChart')
      .select('svg')
      .remove();
d3.select('#lineChart')
      .select('.tooltip')
      .remove();
// Adds the svg canvas
const svg = d3.select("#lineChart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("nse_data.csv", function(error, data) {
allGroup =d3.map(data, function(d){return(d.SYMBOL)}).keys();
d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; })

d3.select("#selectButton").on("change", function(d) {
        var selectedOption = d3.select(this).property("value")
        draw(selectedOption)
        document.getElementById("hTitle").innerHTML= selectedOption +' Stock Trend Analysis';
    })

draw("TCS");
 function draw(selectedGroup){
  const dataFilter = data.filter(function(d){return d.SYMBOL==selectedGroup})
  dataFilter.forEach(function(d) {

    d.date = parseDate(d.TIMESTAMP);
    d.open = +d.OPEN;
    d.close = +d.CLOSE;
    d.high = +d.HIGH;
    d.low = +d.LOW;
    d.last = +d.LAST;
  });
  // Scale the range of the data
  x.domain(d3.extent(dataFilter, function(d) { return d.date; }));
  y.domain([0, d3.max(dataFilter, function(d) { return d.close; })]);

 d3.select('#lineChart')
        .selectAll('path')
        .remove();

  // Add the valueline path.
  svg.append("path")
    .attr("class", "line")
    .transition()
    .duration(1000)
    .attr("d", valueline(dataFilter));


        d3.select('#lineChart')
        .selectAll(".axis").remove();
  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .transition()
    .duration(200)
    .call(yAxis);

d3.select('#lineChart')
        .selectAll(".focus").remove();

const focus = svg
    .append('g')
    .attr('class', 'focus')
    .style('display', 'none');

focus.append('circle').attr('r', 5).attr('class', 'circle');

d3.select('#lineChart')
      .select('.tooltip')
      .remove();

const tooltip = d3
    .select('#lineChart')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);


d3.select('#lineChart')
        .selectAll("rect").remove();
svg
    .append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .style('opacity', 0)
    .on('mouseover', () => {
        focus.style('display', null);
    })
    .on('mouseout', () => {
      focus.style("display", "none");
        tooltip
            .transition()
            .duration(300)
            .style('opacity', 0);
    })

   .on('mousemove', mousemove);
function mousemove(event) {
    const bisect = d3.bisector(d => d.date).left;
    const xPos = d3.mouse(this)[0];
    const x0 = bisect(data, x.invert(xPos));
    const d0 = data[x0];
    focus.attr(
        'transform',
        `translate(${x(d0.date)},${y(+d0.close)})`,
    );
    tooltip
        .transition()
        .duration(100)
        .style('opacity', 1);
    tooltip
        .html(
          d0.tooltipContent || (
          'Date: '+'<span style="font-size: 12px; font-weight: bold">'+formatDate(parseDate(d0.TIMESTAMP))+'</span><br> '
          +'Open: '+'<span style="font-size: 12px; font-weight: bold">'+d0.open +'</span><br> '
          +'Close: '+'<span style="font-size: 12px; font-weight: bold">'+d0.close+'</span><br> '
          +'High: '+'<span style="font-size: 12px; font-weight: bold">'+d0.high +'</span><br> '
          +'Low: '+'<span style="font-size: 12px; font-weight: bold">'+d0.low+'</span>'
          )
        )
        .style(
            'transform',
            `translate(${x(d0.date) + 35}px,${y(d0.close) - 35}px)`,
    );
  }
}

});
