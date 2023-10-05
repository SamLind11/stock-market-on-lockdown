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

//Create a grouped bar chart for average stock price by sector for three time periods.
function generateGroupBarChart(selection) {
    let userChoice = meta[selection];

    // Create initial graph.
    let stockData = [];

    layout = {
        title: selection === 'finance' ? 'Finance Stocks':
               selection === 'socialMedia' ? 'Social Media Stocks':
               selection === 'healthcare' ? 'Healthcare Stocks': 'Retail Stocks'
        };
    
        //Calculate the avearge values for each sector.
        let sectorAverages = [];

        stockData.forEach(function(stock) {
            if (!sectorAverages[stock.sector]) {
                sectorAverages[stock.sector] = {
                    total: 0,
                    count: 0
                };
            }
            sectorAverages[stock.sector].total += stock.value;
            sectorAverages[stock.sector].count++;
        });

        for(var sector in sectorAverages) {
            sectorAverages[sector].averag = sectorAverages[sector].total / sectorAverages[sector].count;
        }

        //Create Greouped Bar Chart
        var sectors = Object.keys(sectorAverages);
        var averageValues = sectors.map(function(sector) {
            return sectorAverages[sector].average;
        });

        var ctx = document.getElementById("grouped-bar-chart").getContext("2d");

        var chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: sectors,
                datasets: [
                    {
                        label: "Average Stock Value",
                        data: averageValues,
                        backgroundColor: "rgba(75, 192, 192, 0.2)", 
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    }]
                }
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
        });