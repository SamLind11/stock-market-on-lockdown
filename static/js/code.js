// Code to generate overlapping line plots for a sector from user input.
function generateLineGraph(selection) {
    let sectorData = meta[selection];

    // Create initial graph.
     let data = [];
     let layout = {
        // CHANGE THIS
        title: `${selection.charAt(0).toUpperCase() + selection.slice(1)} Sector`,
        width: 1500,
        height: 700,
    };

    Plotly.newPlot("multiplot", data, layout);

    sectorData.forEach(company => {
        let stockSymbol = company.symbol.toLowerCase();
        
        //Fetch stock data from Flask API.
        fetch('/api/stock_data?stock_symbol=${stockSymbol}')
            .then(response => response.json())
            .then(stockData => {
                let dates = stockData.data.map(stock => stock.date); 
                let values = stockData.data.map(stock => stock.high);

                //Create the trace for the data.
                let trace = {
                    x: dates,
                    y: values,
                    type: "scatter",
                    name: `${stockSymbol.toUpperCase()} - ${company.name}`,
                    text: stockSymbol.toUpperCase()
                };

                //Add the trace to the plot.
                Plotly.addTraces("multiplot", trace);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

//Generate initial graph on page load for the finance sector.
generateLineGraph('finance');


//     for (let i = 0; i < userChoice.length; i++){
//         // Generate url.
//         let stockSymbol = userChoice[i].symbol; 
//         let stockName = userChoice[i].name;
//         // let link = `https://samlind11.github.io/stock-market-on-lockdown/json/${stockSymbol}.json`;

//         // Fetch json data from Github.
//         d3.json(link).then(response => {

//             dates = Object.keys(response);
//             values =[];
            
//             // Loop through all dates and add the corresponding stock price to values.
//             for (let i = 0; i < dates.length; i++) {
//                 values.push(response[dates[i]]["high"]);
//             }

//             // Create the trace for the data.
//             trace = {
//                 x: dates,
//                 y: values,
//                 type: "scatter",
//                 name: `${stockName} (${stockSymbol.toUpperCase()})`,
//                 text: stockSymbol.toUpperCase()
//             };

//             // Add the trace to the plot.
//             Plotly.addTraces("multiplot", trace);
//         });
//     }
// }

// // Generate initial graph on page load.
// generateLineGraph('finance');