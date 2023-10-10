// Code to generate overlapping line plots for a sector from user input.
function generateLineGraph(selection) {

    let userChoice = meta[selection];

    // Create initial graph.
    let data = [];
    firstCase = 0.29;

    layout = {
        title: selection === 'finance' ? 'Finance Stocks':
               selection === 'socialMedia' ? 'Social Media Stocks':
               selection === 'healthcare' ? 'Healthcare Stocks': 'Retail Stocks', 
        width: 1500,
        height: 700,
        xaxis: {
            nticks: 13, 
            tickmode: 'auto'},
        yaxis: {title: 'Stock Price (USD)'},

        // Vertical line for first case of COVID date.
        shapes: [
        {
            type: 'line',
            xref: 'paper',
            yref: 'paper',
            x0: firstCase,
            y0: 0,
            x1: firstCase,
            y1: 1,
            line: {
            color: 'grey',
            width: 1.5,
            dash: 'dot'
            }
        }
        ],
        annotations: [{
            xref: 'paper',
            yref: 'paper',
            x: 0.3,
            y: 1,
            //************Change to hover-over text?
            text: 'First Recorded Covid-19 Case in US <br> 01/20/2020',
            // textangle: -90,
            showarrow: false
        }]
    };

    Plotly.newPlot("multiplot", data, layout);

    for (let i = 0; i < userChoice.length; i++){
        // Generate url.
        let stockSymbol = userChoice[i].symbol; 
        let stockName = userChoice[i].name;
        let link = `http://127.0.0.1:5000/api/data/${stockSymbol}`;

        // Fetch json data from Flask API.
        d3.json(link).then(response => {

            dates= [];
            highs = [];
            for (let i = 0; i < response.length; i++) {
                // Convert date values for the 'pins' stock.
                if (stockSymbol === 'pins') {
                    dates.push(processPinsDate(response[i]['date']));
                } else {
                    dates.push(response[i]['date']);
                }
                highs.push(response[i]['high'])
            }
            if (stockSymbol === 'pins') console.log(dates);
            // Create the trace for the data.
            trace = {
                x: dates,
                y: highs,
                type: "scatter",
                name: `${stockName} (${stockSymbol.toUpperCase()})`,
                text: stockSymbol.toUpperCase()
            };

            // Add the trace to the plot.
            Plotly.addTraces("multiplot", trace);
        });
    }
}

// Generate initial graph on page load.
generateLineGraph('finance');



//Create Percent Change Bar Chart
//Function to update the percent change graph based on the selected sector
async function updatePercentChangeGraph() {
    // Get the selected sector from the dropdown
    let selectedSector = document.getElementById("sectorSelection").value;

    //Call the generateBarGraph function with the selected sector
    await generateBarGraph(selectedSector);
}

//Create Percent Change Bar Chart
async function generateBarGraph(selection) {
    let userChoice = meta[selection];
    let data = [];

    //Fetch data from Flask API  
    for (let j = 0; j < userChoice.length; j++){
        // Generate url.
        let stockSymbol = userChoice[j].symbol; 
        let stockName = userChoice[j].name;
        let link = `http://127.0.0.1:5000/api/data/${stockSymbol}`;
    
        // Fetch json data from Flask API.(add ; to end of line 130)
        const response = await d3.json(link);
        console.log(response);
        
        //Filter data for the first date range (10/1/19 to 3/24/20)
        let firstDateRangeData = response.find(d => d.date === '10/1/19') || {high: 0};
        let firstDateRangeHigh = response.find(d => d.date === '3/24/20')?.high || 0;
        
        //Calculate percent change for the first date range. 
        let firstDateRangePercentChange = ((firstDateRangeHigh - firstDateRangeData.high) / firstDateRangeData.high) * 100;

        //Filter data for the second date range (10/1/19 to 7/16/20)
        let secondDateRangeData = response.find(d => d.date === '10/1/19') || {high: 0};
        let secondDateRangeHigh = response.find(d => d.date === '7/16/20')?.high || 0;

        //Calculate percent change for the second date range.
        let secondDateRangePercentChange = ((secondDateRangeHigh - secondDateRangeData.high) / secondDateRangeData.high) * 100;

        // Create traces for the two date ranges. 
        let firstTrace = {
            x: [stockName],
            y: [firstDateRangePercentChange],
            type: "bar",
            name: `Percent Change from 10/1/19 to 3/24/20`,
            legendgroup: 'group1',
            text: ['% change from Oct to March'],
            marker: {
                color: 'rgb(31, 119, 180)'
            }
        };

        let secondTrace = {
            x: [stockName],
            y: [secondDateRangePercentChange],
            type: "bar",
            name: `Percent Change from 10/1/19 to 7/16/20`,
            legendgroup: 'group2',
            text: ['% change from Oct to July'],
            marker: {
                color: 'rgb(255, 127, 14)'
            }
        };
       
 

        // Add the traces to the data array
        data.push(firstTrace, secondTrace);
    }

    //Clear existing data and layout
    Plotly.purge("percentChangeGraph");

    //Create the new graph based on the selection
    let layout = {
        barmode: 'group',
        title: selection === 'finance' ? 'Finance Stocks':
               selection === 'socialMedia' ? 'Social Media Stocks':
               selection === 'healthcare' ? 'Healthcare Stocks': 'Retail Stocks', 
        width: 1500,
        height: 700
    };

    //Create the new graph with updated data and layout
    Plotly.newPlot("percentChangeGraph", data, layout);
}  

// Call the updatePercentChangeGraph function when the page loads to initialize the graph
updatePercentChangeGraph();




//Create Gains and Losses Graph
function fetchDataAndCreateChart(selectSymbol) {
    // Get stock name from metadata.js.
    keys = Object.keys(meta);
    let stockName = "";
    for (let i = 0; i < keys.length; i++) {
        sector = meta[keys[i]];
        for (let j = 0; j < sector.length; j++) {
            if (sector[j]['symbol'] == selectSymbol.toLowerCase()) {
                stockName = sector[j]['name'];
            }
        }
    }

    // URL to JSON data on GitHub
    selectSymbol = selectSymbol.toLowerCase(); //SAM EDIT
        let dataURL = `http://127.0.0.1:5000/api/data/${selectSymbol}`;

    d3.json(dataURL).then(response => {

        dates= [];
        // highs = [];
        // lows = []; 
        gainsandlosses = [];

        for (let i = 0; i < response.length; i++) {
            dates.push(response[i]['date'])
            // highs.push(response[i]['high'])
            // lows.push(response[i]['low'])
            let change = response[i]['close'] - response[i]['open'];
            gainsandlosses.push(change);

        }
            //Create chart instance
    new Chart(document.getElementById('bar-chart'), {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Daily Gain/Loss in USD',
                    data: gainsandlosses,
                    backgroundColor: gainsandlosses.map(value => (value >= 0 ? 'green' : 'red'))
                }
            ]
        },
        options: {
            events: [],
            responsive: false,
            title: {
                display: true,
                text: `Daily Stock Gains/Losses for ${stockName} (${selectSymbol.toUpperCase()})`
            },
            scales: {
                xAxis: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        display: true,
                        text: 'Gain/Loss'
                    }
                }
            }
        }
    });
    });
}
fetchDataAndCreateChart('wfc');

// Function which converts date strings for the 'pins' stock.
function processPinsDate(date) {
    let d = date.split("/");
    let month = parseInt(d[0], 10);
    let day = parseInt(d[1], 10);
    let year = d[2].slice(2,4);
    console.log(`${month}/${day}/${year}`);
    return `${month}/${day}/${year}`;
}