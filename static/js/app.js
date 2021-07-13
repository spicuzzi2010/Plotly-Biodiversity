//function to create initial plots on th page
function getData(){
  d3.json("samples.json").then(function(data) {
      //retreive values and names from json file
      var names = Object.values(data.names);
     //used d3 to select the proper placment for the sample names
      d3.select("select").selectAll("option")
      .data(names)
      .enter()
      .append("option")
      //return the text for each sample name
      .text(function(d) {
          return d;
      })
      .attr("value", function(d){
          return d;
      });
      var sample = names[0];
      plot(sample);
      demographics(sample);
      gage(sample);
  });
}
getData()

function plot(id){
  d3.json("samples.json").then(function(data) {
      
  //getting the info for the user inputted sample id 
  var samples = Object.values(data.samples);
  var result = samples.filter(row => row.id == id);
  var resultData = result[0];
      
  //created variables for the information needed to chart
  var otuIDs = resultData.otu_ids
  var sampleValues = resultData.sample_values
  var otuLabels = resultData.otu_labels 
      
  //sliced each above variable to give the top 10
  var topOtuIds = otuIDs.slice(0, 10);
  var topSampleValues = sampleValues.slice(0, 10);
  var topOtuLabels = otuLabels.slice(0, 10);
      
  //variable used to create lables for bar chart
  //var otuIdsString = topOtuIds.map(item => `OTU ${item}`);
  
  //bar chart
  var barData = [{
      x: topSampleValues.reverse(),
      y: topOtuIds.reverse(),
      text:topOtuLabels.reverse(),
      name: "Top 10 Bacteria Cultures Found",
      type: "bar",
      orientation: 'h'
  }];
  //bubble chart
  var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      mode: 'markers',
      marker: {
          size: sampleValues,
         color:otuIDs 
      },
      text:otuLabels
  }];
  //bar chart layout
  var barLayout = {
      title: {
          text:"Top 10 Bacteria Cultures Found"
      }
  };
  //bubble chart layout
  var bubbleLayout ={
      title:{
          text: "Bacteria Cultures per Sample"
      }
  }
  //plot bubble and bar charts
  Plotly.newPlot('bar', barData, barLayout);
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    });
    
}


function gage(id){
  d3.json("samples.json").then(function(data){
  //return values from json file for samples and filtered by user inputted sample id
  var metaData = Object.values(data.metadata);
  var result = metaData.filter(row => row.id == id);
  var resultData = result[0];
  //set variable for the wash frequency data
  var wfreq = resultData.wfreq 
  //set up gauge data
  var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Wash Frequency" },
        type: "indicator",
        mode: "gauge",
        
        gauge: {
          axis: { range: [null, 9 ]},
          steps: [
            { range: [0, 1], color: "rgba(0,128,128,.05)" },
            { range: [1, 2], color: "rgba(0,128,128,.1)" },
            { range: [2, 3], color: "rgba(0,128,128,.15)" },
            { range: [3, 4], color: "rgba(0,128,128,.2)" },
            { range: [4, 5], color: "rgba(0,128,128,.25)" },
            { range: [5, 6], color: "rgba(0,128,128,.3)" },
            { range: [6, 7], color: "rgba(0,128,128,.35)" },
            { range: [7, 8], color: "rgba(0,128,128,.4)" },
            { range: [8, 9], color: "rgba(0,128,128,.45)" }
            
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: wfreq
          }
        }
      }
    ];
    //set up layout
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    //plot using the data and layout
    Plotly.newPlot('gauge', data, layout);
  });
}


//set up function to build the demographics for each sample
function demographics(id){
  d3.json("samples.json").then(function(data) {
  //obtained values from json data file for samples and filtered by 
  //user inputted sample id    
  var metaData = Object.values(data.metadata);
  var result = metaData.filter(row => row.id == id);
  var resultData = result[0];
      
  //selected the id name to find were to add the demographic info
  var info = d3.select("#sample-metadata");
  info.html("");
  //used key and value to append the above variable with the demographic info
  Object.entries(resultData).forEach(([key, value]) => {
      info.append('h6').text(`${key} : ${value}`);
      });
  });
}



//used function that was called in the index.html to select a new sample
//from the json data file using a user input
function optionChanged(newSample){
 //call all of the previous functions with the user input
  demographics(newSample);
  plot(newSample);
  gage(newSample);
  
  
}
