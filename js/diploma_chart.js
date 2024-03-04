// Load Google Charts library API and corechart package
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
// Function to draw the chart
function drawChart() {
   
    fetch('assets/diploma_data.geojson')
        .then(response => response.json())
        .then(data => {
   
            var chartData = new google.visualization.DataTable();
            chartData.addColumn('number', 'Population_over24');
            chartData.addColumn('number', 'Percent_without_diploma');



            data.features.forEach(feature => {
                chartData.addRow([
                    feature.properties.Population_Over24,
                    parseFloat(feature.properties.Percent_Without_Diploma)
                ]);
            });

            var options = {
                title: 'Population Over 24 vs. Percent Without Diploma',
                hAxis: {
                    title: 'Population Over 24',
                    minValue: 0,

                    viewWindow: {
                        max: 12000
                    },
                },
                vAxis: {
                    title: 'Percent Without Diploma',
                    minValue: 0,
                    maxValue: 100},
                legend: 'none'
            };
            console.log(options)
            var chart = new google.visualization.ScatterChart(document.getElementById('diploma_chart'));
            chart.draw(chartData, options);
        })
        .catch(error => console.error('Error loading data:', error));
}

