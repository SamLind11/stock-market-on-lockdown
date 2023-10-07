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
                dates.push(response[i]['date'])
                highs.push(response[i]['high'])
            }
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
async function generateBarGraph(selection) {
    let userChoice = meta[selection];

    // Create initial graph.
    let layout = {
        barmode: 'group',
        title: selection === 'finance' ? 'Finance Stocks':
               selection === 'socialMedia' ? 'Social Media Stocks':
               selection === 'healthcare' ? 'Healthcare Stocks': 'Retail Stocks', 
        width: 1500,
        height: 700
    };
    let data = [];

    //Fetch data from Flask API  
    for (let i = 0; i < userChoice.length; i++){
        // Generate url.
        let stockSymbol = userChoice[i].symbol; 
        let stockName = userChoice[i].name;
        let link = `http://127.0.0.1:5000/api/data/${stockSymbol}`;
    
        // Fetch json data from Flask API.(add ; to end of line 130)
        const response = await d3.json(link);
        console.log(response);
        
        //Filter data for the first date range (10/1/19 to 3/24/20)
        let firstDateRangeData = response.find(d => d.date === '10/1/19') || {high: 0};
        let firstDateRangeHigh = response.find(d => d.date === '3/24/20').high;
        
        //Calculate percent change for the first date range. 
        let firstDateRangePercentChange = ((firstDateRangeHigh - firstDateRangeData.high) / firstDateRangeData.high) * 100;

        //Filter data for the second date range (10/1/19 to 7/16/20)
        let secondDateRangeData = response.find(d => d.date === '10/1/19') || {high: 0};
        let secondDateRangeHigh = response.find(d => d.date === '7/16/20').high;

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
       
        // Add the traces to the plot.
        data.push(firstTrace, secondTrace);
    }

    Plotly.newPlot("percentChangeGraph", data, layout);
}

generateBarGraph('finance');




//Create Gains and Losses Graph
function fetchDataAndCreateChart(selectSymbol) {
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
                    label: 'Gain/Loss',
                    data: gainsandlosses,
                    backgroundColor: gainsandlosses.map(value => (value >= 0 ? 'green' : 'red'))
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Gains and Losses Over Time'
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
