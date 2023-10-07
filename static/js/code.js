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
    //  const link = `http://127.0.0.1:5000/api/data/${stockSymbol}`;
    //  const response = await d3.json(link);
    //     console.log(response);

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

    // var trace1 = {
    //     x: ['giraffes', 'orangutans', 'monkeys'],
    //     y: [20, 14, 23],
    //     name: 'SF Zoo',
    //     type: 'bar'
    //   };
      
    //   var trace2 = {
    //     x: ['giraffes', 'orangutans', 'monkeys'],
    //     y: [12, 18, 29],
    //     name: 'LA Zoo',
    //     type: 'bar'
    //   };
      
    //   var data = [trace1, trace2];
      
    //   var layout = {barmode: 'group'};
   //chatGPT suggests commenting out next line   
    //   Plotly.newPlot('percentChange', data, layout);
    //Fetch data from Flask API  
    for (let i = 0; i < userChoice.length; i++){
        // Generate url.
        let stockSymbol = userChoice[i].symbol; 
        let stockName = userChoice[i].name;
        let link = `http://127.0.0.1:5000/api/data/${stockSymbol}`;
    
        // Fetch json data from Flask API.(add ; to end of line 130)
        const response = await d3.json(link);
        console.log(response);
        
        //Filter data for the first date range (10/1/19 to 3/24/20).. chatGPT #2 suggestions
        // let firstDateRangeData = response.filter(d => {
        //     let date = new Date(d.date);
        //     let startDate = new Date('10/1/19');
        //     let endDate = new Date('3/24/20');
        //     return date >= startDate && date <= endDate;
        // });
        let firstDateRangeData = response.find(d => d.date === '10/1/19') || {high: 0};
        let firstDateRangeHigh = response.find(d => d.date === '3/24/20').high;
        
        //Calculate percent change for the first date range. chatGPT suggests adding next 7 lines (and re-did after #2 and again after #4)
        // let firstDateRangePercentChanges = firstDateRangeData.map(d => {
        //    let oldValue= firstDateRangeData[0].high;
        //    let newValue= d.high
        //    return ((newValue - oldValue) / oldValue) * 100;
        // });
        let firstDateRangePercentChange = ((firstDateRangeHigh - firstDateRangeData.high) / firstDateRangeData.high) * 100;

        //Filter data for the second date range (10/1/19 to 7/16/20)
        // let secondDateRangeData = response.filter(d => {
        //     let date = new Date(d.date);
        //     let startDate = new Date('10/1/19');
        //     let endDate = new Date('7/16/20');
        //     return date >= startDate && date <= endDate;
        // });
        let secondDateRangeData = response.find(d => d.date === '10/1/19') || {high: 0};
        let secondDateRangeHigh = response.find(d => d.date === '7/16/20').high;

        //Calculate percent change for the second date range.
        // let secondDateRangePercentChanges = secondDateRangeData.map(d => {
        //       let oldValue= secondDateRangeData[0].high;
        //       let newValue= d.high;
        //       let stockPercentChange = ((newValue - oldValue) / oldValue) * 100;
        //       return ((newValue - oldValue) / oldValue) * 100;
        //   });
        let secondDateRangePercentChange = ((secondDateRangeHigh - secondDateRangeData.high) / secondDateRangeData.high) * 100;

        // Create traces for the two date ranges. ChatGPT suggestions for the 
        // let trace1 = {
        //     x: firstDateRangeData.map(d => d.date),
        //     y: firstDateRangePercentChanges,
        //     type: "bar",
        //     name: `${stockName} (${stockSymbol.toUpperCase()}) - 10/1/19 to 3/24/20`,
        //     text: firstDateRangeData.map(d => d.high),
        // };
        let firstTrace = {
            x: [stockName],
            y: [firstDateRangePercentChange],
            type: "bar",
            name: `${stockSymbol.toUpperCase()} - 10/1/19 to 3/24/20`,
            text: ['${firstDateRangePercentChange.toFixed(2)}%'],
            marker: {
                color: 'rgb(31, 119, 180)'
            }
        };

        let secondTrace = {
            x: [stockName],
            y: [secondDateRangePercentChange],
            type: "bar",
            name: `${stockSymbol.toUpperCase()} - 10/1/19 to 7/16/20`,
            text: ['${secondDateRangePercentChange.toFixed(2)}%'],
            marker: {
                color: 'rgb(255, 127, 14)'
            }
        };
        // let trace2 = {
        //     x: secondDateRangeData.map(d => d.date),
        //     y: secondDateRangePercentChanges,
        //     type: "bar",
        //     name: `${stockName} (${stockSymbol.toUpperCase()}) - 10/1/19 to 7/16/20`,
        //     text: secondDateRangeData.map(d => d.high),
        // };

        // Add the trace to the plot. ChatGPT suggestions (until line 158)
        // data.push(trace1, trace2);
        data.push(firstTrace, secondTrace);
    }

    // Plotly.newPlot("percentChange", [].concat(...data), layout);
// }
    Plotly.newPlot("percentChange", data, layout);
}

generateBarGraph('finance');

//ChatGPT suggests commenting out next lines until line 191
//         const midpointIndex = response.findIndex(d => d.date === '3/24/20');
//         // const firsthalf = response.slice(0, midpointIndex+1);
//         const midChange = response[midpointIndex].high - response[0].high;
//         console.log(midChange);        
//                 dates= [];
//                 highs = [];
//                 for (let i = 0; i < response.length; i++) {
//                     dates.push(response[i]['date'])
//                     highs.push(response[i]['high'])
//                 }
//                 // New code (calculate percent change)
//                 let oldValue= highs[0]
//                 let newValue= highs[i]
//                 let stockPercentChange = ((newValue - oldValue) / oldValue) * 100;

//                 // Create the trace for the data.
//                 var trace= {
//                     x: dates,
//                     y: stockPercentChange,
//                     type: "bar",
//                     name: `${stockName} (${stockSymbol.toUpperCase()})`,
//                     text: stockSymbol.toUpperCase()
//                 };
    
//                 // Add the traces to the plot.
//                 Plotly.addTraces("percentChange", trace);
//                 // Plotly.newPlot("percentChange", [trace1], layout);

//     }
// }
// generateBarGraph('finance');

//         for(var sector in sectorAverages) {
//             sectorAverages[sector].averag = sectorAverages[sector].total / sectorAverages[sector].count;
//         }

//         //Create Greouped Bar Chart
//         var sectors = Object.keys(sectorAverages);
//         var averageValues = sectors.map(function(sector) {
//             return sectorAverages[sector].average;
//         });

//         var ctx = document.getElementById("grouped-bar-chart").getContext("2d");

//         var chart = new Chart(ctx, {
//             type: "bar",
//             data: {
//                 labels: sectors,
//                 datasets: [
//                     {
//                         label: "Average Stock Value",
//                         data: averageValues,
//                         backgroundColor: "rgba(75, 192, 192, 0.2)", 
//                         borderColor: "rgba(75, 192, 192, 1)",
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: {
//                         yAxes: [{
//                             ticks: {
//                                 beginAtZero:true
//                             }
//                         }]
//                     }
//                 }
//         });

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
