// Load Google Charts library API and corechart package
google.charts.load('current', {'packages':['corechart']});

// Function to draw the chart
function drawChart() {
    // Load GeoJSON file
    fetch('assets/diploma_data.geojson')
        .then(response => response.json())
        .then(data => {
            // Extract necessary data from GeoJSON
            var rawData = data.features.map(feature => ({
                Population_over24: feature.properties.Population_Over24,
                Percent_without_diploma: feature.properties.Percent_Without_diploma
            }));

            // Convert raw data into Google Charts compatible format
            var chartData = new google.visualization.DataTable();
            chartData.addColumn('number', 'Population_Over24');
            chartData.addColumn('number', 'Percent_Without_Diploma');

            rawData.forEach(function(item) {
                chartData.addRow([item.Population_Over24, item.Percent_Without_Diploma]);
            });

            // Set bounds for axes
            var options = {
                title: 'Population Over 24 vs. Percent Without Diploma',
                hAxis: {title: 'Population Over 24', minValue: 0, maxValue: 8000},
                vAxis: {title: 'Percent Without Diploma', minValue: 0, maxValue: 100},
                legend: 'none'
            };

            // Create chart
            var chart = new google.visualization.ScatterChart(document.getElementById('scatter_plot'));
            chart.draw(chartData, options);
        })
        .catch(error => console.error('Error loading data:', error));
}

// Set callback function when Google Charts library is loaded
google.charts.setOnLoadCallback(drawChart);