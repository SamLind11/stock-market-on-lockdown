// Code to generate overlapping line plots for a sector from user input.
function generateLineGraph(selection) {
    let userChoice = meta[selection];

    // Create initial graph.
    let data = [];
    layout = {
        // CHANGE THIS
        title: `EDIT ME Sector`,
        width: 1500,
        height: 700,
    };

    Plotly.newPlot("multiplot", data, layout);

    for (let i = 0; i < userChoice.length; i++){
        // Generate url.
        let stockSymbol = userChoice[i].symbol; 
        let stockName = userChoice[i].name;
        let link = `https://samlind11.github.io/stock-market-on-lockdown/json/${stockSymbol}.json`;

        // Fetch json data from Github.
        d3.json(link).then(response => {

            dates = Object.keys(response);
            values =[];
            
            // Loop through all dates and add the corresponding stock price to values.
            for (let i = 0; i < dates.length; i++) {
                values.push(response[dates[i]]["high"]);
            }

            // Create the trace for the data.
            trace = {
                x: dates,
                y: values,
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