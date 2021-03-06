// location of data file
let csv = 'HW2Sort.csv';
console.log("CSV:"+csv);

// configuration of svg/plot area
let config = {
  'svg': {},
  'margin': {},
  'plot': {}
};
config.svg.height = 450;
config.svg.width = config.svg.height * 1.618; // golden ratio
config.margin.top = 10;
config.margin.right = 10;
config.margin.bottom = 20;
config.margin.left = 100;
config.plot.x = config.margin.left;
config.plot.y = config.margin.top;
config.plot.width = config.svg.width - config.margin.left - config.margin.right;
config.plot.height = config.svg.height - config.margin.top - config.margin.bottom;

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}
var svg = d3.select("#parallelChart").append('svg')
    .attr('width', config.svg.width)
    .attr('height', config.svg.height+100)
    .append("g")
    .attr("transform", translate(config.plot.x, config.plot.y));
console.log("svg: "+JSON.stringify(svg))

d3.csv(csv, convertRow).then(drawChart);
function convertRow(row,index){
      let out ={};
      // out.values =[];
      for (let col in row) {
        switch (col) {
          // these are the text columns that do not need conversion
          case 'type':
            out[col] = parseInt(row[col]);
            // console.log("typee:"+out[col]);
            break;
          case 'state':
            out[col] = row[col];
             // console.log("state:"+out[col]);
            break;
          case 'tier':
            out[col] = row[col];
            // console.log("tier:"+out[col]);
            break;
          case 'iclevel':
            out[col] = parseInt(row[col]);
            console.log("iclevel:"+out[col]);
            break;
          case 'par_mean':
          out[col] = parseInt(row[col]);
           // console.log("Par Mean:"+out[col]);
          break;
          case 'region':
            out[col] = parseInt(row[col]);
            // console.log("region:"+out[col]);
            break;
        }
      }
  return out;
}

function drawChart(data){
  // data = data.filter(function(row) {
  //     return row['par_mean'] > 200000;
  // });
  // data = data.filter(function(row) {
  //     return row['state'] === "CA"|| row['state'] === "NY" || row['state'] ==="NJ";
  // });
  // data.sort(function(a,b){
  //   return a['state'].localeCompare(b['state']) || a['type']-b['type']
  // });

  console.log("data:"+JSON.stringify(data));
  var color = d3.scaleOrdinal()
    .domain(["CA","NJ","NY",])
    .range(["#bf6969","#69bf69","#6969bf"])
    // .domain(["CA"])
    // .range([ "#DC143C"])
  // console.log("Data1:"+JSON.stringify(data));
  dimensions = d3.keys(data[0]).filter(function(d) { return d != "state" && d != "par_mean"})

  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }
  var y = {};
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
     // .domain([1,14])
    .domain( d3.extent(data, function(d) { return d[name]; }) )
    .range([config.svg.height, 0])
  }
  x = d3.scalePoint()
   .range([0,config.svg.width-200])
   .domain(dimensions);

   svg
    .selectAll("myPath")
     .data(data)
     .enter()
     .append("path")
     .attr("class", function (d) { return d.state } )
     .attr("d",  path)
     .style("fill", "none" )
     .style("stroke", function(d){ return( color(d.state))} )
     .style("opacity", 0.5)


   svg.selectAll("myAxis")
     .data(dimensions).enter()
     .append("g")
     .attr("class", "axis")
     .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
     .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
     .append("text")
       .style("text-anchor", "middle")
       .style("font", "14px times")
       .attr("y", 0)
       .attr("x", 20)
       .text(function(d) { return d; })
       .style("fill", "black")
}
