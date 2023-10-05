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