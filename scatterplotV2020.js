
    //Define Margin
    var margin = {left: 80, right: 80, top: 40, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //graph graph space before we add stuff
    var graph = d3.select("svg");
    //Define Scales   
    var xScale = d3.scaleLinear()
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .range([height, 0]);
    
    var rScale = d3.scaleSqrt();//used for circle radius scaling
      
       //Define Axis
    var xAxis = d3.axisBottom(xScale);
        
        
        
    var yAxis = d3.axisLeft(yScale);
        
        
        
    //simple row converter function to grab all data associated with each country
    function rowConverter(data) {
    return {
        country : data.country,
        gdp : +data.gdp,
        pop : +data.population,
        ecc : +data.ecc,
        ec : +data.ec //total energy consumption
        }
    }
    
    d3.csv("scatterdata.csv", rowConverter).then(function(data){                               
    //Get Data
    // Define domain for xScale and yScale
    //console.log(d3.min(data, function(d){return d.gdp;}));
    //console.log(d3.min(data, function(d){return d.gdp;}));
    //i thought it'd look a bit nicer if the domain both started with 0
    //so at the start the circles arent clipping the y-axis
    //added the .nice() for nice tick values
    xScale.domain([0, d3.max(data, function(d){return d.gdp;})]).nice();
    yScale.domain([0, d3.max(data, function(d){return d.ecc;})]).nice();
    
        
    //I used the d3v5 pan and zoom example given in the assignment pdf  
    //https://bl.ocks.org/mbostock/db6b4335bf1662b413e7968910104f0f/e59ab9526e02ec7827aa7420b0f02f9bcf960c7d 
    //d3.zoom has dragging and zooming capabilites already
    //.scaleExtent lets you define the minimum value to be scaled by which means the most you can zoom out, and the max value to be scaled by which is the most you can zoom in
    //,translateExtent is for pan/drag, you specify the minimum x and y position to where you can drag as well as the max x,y position you can drag
    //.on("zoom") is an event listener which is a function of d3. I'm assuming the event its waiting for is either a click and drag or scroll wheel input. Then it calls our zoomed function which is defined below
    var zoom = d3.zoom()
    .scaleExtent([0.5, 40])
    .translateExtent([[-200, -200], [width + 500, height + 500]])
    .on("zoom", zoomed); 
        
    //var view = d3.select("body");
    //since the html code for a centered colon was the same i just put it in a var
    var colon = "<div class='center'>:</div>";
        
        //Used https://bl.ocks.org/d3noob/a22c42db65eb00d4e369 for tooltip reference 
    //tooltip element is created from a html div element.
    //opacity is set to 0 to hide it will its not on anything
    var tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    //Draw Scatterplot
    //my html is messy but i was able to create a tooltip bar
    //with the correct alignments and labels however my right aligned text would wrap wierdly and i couldnt figure out why
    var view = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return rScale(d.ec * 25);})//get radius values
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.ecc);})
        .style("fill", function (d) { return colors(d.country);})
        .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9); //when mouse is hovering over svg, show tooltip		
            tooltip.html(
"<div style='text-align:center;'>"+d.country+"</div>"+
"<div class='left'>Population</div>"+colon+"<div class='right'>"+d.pop+" Million"+"</div>"+
"<div class='left'>GDP</div>"+colon+"<div class='right'>"+"$"+d.gdp+" Trillion"+"</div>"+
"<div class='left'>EPC</div>"+colon+"<div class='right'>"+d.ecc+" Million BTUs"+"</div>"+
"<div class='left'>Total</div>"+colon+"<div class='right'>"+d.ec+" Trillion BTUs"+"</div>"+"")
                 //set the x pos of the tool tip to the current mouse x pos
                 //samw with y
                .style("left", (event.clientX) + "px")	
                .style("top", (event.clientY) + "px");	
            })					
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);//when mouse gets off circle tooltip disapears	
        });
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....
       
        
        
        
    
    //Draw Country Names
        
    //i tried to scale the font size and position of the names
    //so they would be relative to the size of the circle and could fit in it
    var names = svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .style("font","sans-serif")
        .style("font-size", function(d){return rScale(d.ec );})
        .attr("x", function(d) {return xScale(d.gdp) - rScale(d.ec * 20);})
        .attr("y", function(d) {return yScale(d.ecc);})
        .style("fill", "black")
        .attr("font-size", "12px")
        .text(function (d) {return d.country; });

 //x-axis
    var gx = svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
        
    //X axis label
    svg.append("text")
        .style("font", "12px sans-serif")
        .text("GDP (in Trillions of US Dollars) in 2010")
        .attr("transform", "translate("+ width/3+"," + 450 + ")")
         

    
    //Y-axis
    var gy = svg.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);
    //Y axis label   
    svg.append("text")
        .style("font", "12px sans-serif")
        .text("Energy Consumption per Capita (in Million BTUs per person)")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left/2 - 10)
        .attr("x", 0 - (height + margin.top + margin.bottom)/2 - 100);
    //used just to move all the circles at once
    var Yoffset = -30;
    var Xoffset = 45;
        
    //all of the code below is for the legend
    //i think its pretty trivial just some circles, a rect and some text
    // i created 3 circles of different sizes whose values i got from my scale function
    var rectL = svg.append("rect")
        .attr("x", width - 130)
        .attr("y", height - 200)
        .attr("width", 200)
        .attr("height", 200)
        .attr("opacity", 0.5)
        .attr("fill", "rgb(128,128,128)");
    svg.append("circle")
        .attr("class", "dot")
        .attr("cx", width - 30 + Xoffset)
        .attr("cy", height/2 + 150 + Yoffset)
        .attr("r", rScale(100 * 25))
        .style("stroke", "white")
        .style("fill", "white");
    svg.append("circle")
        .attr("class", "dot")
        .attr("cx", width - 30 + Xoffset)
        .attr("cy", height/2 + 83 + Yoffset)
        .attr("r", rScale(10 * 25))
        .style("stroke", "white")
        .style("fill", "white");
     svg.append("circle")
        .attr("class", "dot")
        .attr("cx", width - 30 + Xoffset)
        .attr("cy", height/2 + 61 + Yoffset)
        .attr("r", rScale(1 * 25))
        .style("stroke", "white")
        .style("fill", "white"); 
     svg.append("text")
        .style("font", "12px sans-serif")
        .text("100 Trillion BTUs")
        .attr("x", width - 130)
        .attr("y", height - 80)
     svg.append("text")
        .style("font", "12px sans-serif")
        .text("10 Trillion BTUs")
        .attr("x", width - 120)
        .attr("y", height - 145)
     svg.append("text")
        .style("font", "12px sans-serif")
        .text("1 Trillion BTUs")
        .attr("x", width - 110)
        .attr("y", height - 170)
    svg.append("text")
        .style("font", "12px sans-serif")
        .text("Total Energy Consumption")
        .attr("x", width - 110)
        .attr("y", height - 15)
        .style("fill", "green");
        
        
        
    //graph refers to the original svg element, which is the whole graphic space
    //so we can zoom/drag anywhere on the graph not just the circles
    graph.call(zoom);
        
    //var b = d3.selectAll("div");
    //I referenced the zoom link listed earlier for this too
    //when in a function called by an event listener d3 creates a d3.event
    //d3.event has different fields according to the type of event
    //zoom creates a zoom event with fields d3.event.transform which cause
    //the affected svg elements to transform accordingly
    //svg elements have a transform attribute which is com
    function zoomed() {
    //tooltip moves with circle but does not zoom
    tooltip.style("left", (event.clientX) + "px")
        .style("top", (event.clientY) + "px");
    
    //tooltip.style("transform", "translate(" + d3.event.transform.x + "px," + d3.event.transform.y + "px) scale(" + d3.event.transform.k + ")");
        
        
    //is this enough for the 2 super bonus points?
    //svg.attr("transform", d3.event.transform);
    //rectL.attr("transform", d3.event.transform);
    names.attr("transform", d3.event.transform);//country names are also have zoom/drag
    //all of the circles move with drag/zoom    
    view.attr("transform", d3.event.transform);
    //axes get rescaled as we zoom in and out
    gx.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    gy.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
     }
});
