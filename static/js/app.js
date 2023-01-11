// Get the sampleData 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);



// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// 1st function 
function createCharts(personID) {

    // READ & INTERPRET THE DATA
    //--------------------------------------------------------

    // Read the json data file
    d3.json("samples.json").then((data => {

        // Define samples
        var samples = data.samples
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(speciesInfo => speciesInfo.id == personID)[0]

        // Filter by patient ID
        var filteredSample = samples.filter(speciesInfo => speciesInfo.id == personID)[0]

        // Create variables for chart
        // Use sample_values for the horizontal bar chart
        var sample_values = filteredSample.sample_values

        // Use otu_ids as the labels for bar chart
        var otu_ids = filteredSample.otu_ids

        // use otu_labels as the hovertext for bar chart
        var otu_labels = filteredSample.otu_labels

        // Create the trace, For BAR CHART
        
        var trace1 = [{
            // Use otu_ids for the x values
            x: sample_values.slice(0, 10).reverse(),
            // Use sample_values for the y values
            y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            // Use otu_labels for the text values
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(190, 50, 80)'
            },
        }]


        // Define plot layout
        var layout = {
            title: " The Top Ten Microbial Species in Belly Buttons",
            xaxis: { title: " Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        // Display plot
        Plotly.newPlot('bar', trace1, layout)

        //Create the trace, For BUBBLE CHART
        
        var trace2 = [{
            // Use otu_ids for the x values
            x: otu_ids,
            // Use sample_values for the y values
            y: sample_values,
            // Use otu_labels for the text values
            text: otu_labels,
            mode: 'markers',
            marker: {
                // Use otu_ids for the marker colors
                color: otu_ids,
                // Use sample_values for the marker size
                size: sample_values,
                colorscale: 'rgb(150,100,70)'
            }
        }];


        // Define plot layout
        var layout = {
            title: "Belly Button Samples",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        // Display plot
        Plotly.newPlot('bubble', trace2, layout)

        // Create variable for washing frequency,GAUGE CHART
       
        var washFreq = filteredMetadata.wfreq

        // Create the trace
        var gauge_data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { text: "Belly Button Washing Frequency <br> (Scrubs per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'white'},
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 3], color: 'rgb(255, 100, 33)' },
                        { range: [3, 6], color: 'rgb(255, 200, 50)' },
                        { range: [6, 9], color: 'rgb(255, 50, 80)' },
                    ],
                   
                }
            }
        ];

        // Define Plot layout
        var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

        // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    }))


};


// FUNCTION #2 of 4
function populateDemoInfo(personID) {

    var demographicInfoBox = d3.select("#sample-metadata");

    d3.json("samples.json").then(data => {
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(speciesInfo => speciesInfo.id == personID)[0]

        console.log(filteredMetadata)
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicInfoBox.append("p").text(`${key}: ${value}`)
        })


    })
}

// FUNCTION #3 of 4
function optionChanged(personID) {
    console.log(personID);
    createCharts(personID);
    populateDemoInfo(personID);
}

// FUNCTION #4 of 4
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var personIDs = data.names;
        personIDs.forEach(personID => {
            dropdown.append("option").text(personID).property("value", personID)
        })
        createCharts(personIDs[0]);
        populateDemoInfo(personIDs[0]);
    });
};

initDashboard();



