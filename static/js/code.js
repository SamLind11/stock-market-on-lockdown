//Code to generate a line graph for a single stock.

let url = `https://samlind11.github.io/stock_project_files/stock_data.json`;

d3.json(url).then(response => {
    keys = Object.keys(response);
    values =[];
    
    for (let i = 0; i < keys.length; i++) {
        values.push(parseFloat(response[keys[i]]["High"]));
    }
    trace = {
        x: keys.reverse(),
        y: values.reverse(),
        type: "scatter"
    };
    data = [trace];
    layout = {title: "Line Plot"};

    Plotly.newPlot("plot",data,layout);
    
});

// Code to generate overlapping line plots for a sector.
let finance = ['bac','hsbc','wfc','ms','axp'];

let data = [];

// Create initial graph.
layout = {
    title: "Finance Plots",
    width: 1500,
    height: 700,
};

Plotly.newPlot("multiplot", data, layout);

for (let i = 0; i < finance.length; i++){
    // Generate url.
    let stock = finance[i]; 
    let link = `https://samlind11.github.io/stock_project_files/${stock}.json`;

    d3.json(link).then(response => {

        dates = Object.keys(response);
        values =[];
        
        for (let i = 0; i < dates.length; i++) {
            values.push(response[dates[i]]["high"]);
        }
        trace = {
            x: dates,
            y: values,
            type: "scatter",
            name: stock.toUpperCase()
        };
        Plotly.addTraces("multiplot", trace);
    });
}
