google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Income Level', '%'],
        ['Less than $25,000', 20],
        ['$25,000 - $50,000', 30],
        ['$50,000 - $75,000', 25],
        ['$75,000 - $100,000', 15],
        ['More than $100,000', 10]
    ]);

    var options = {
        title: '% of Households by Income Level',
        is3D: true,
        backgroundColor: 'lightblue',
        titleTextStyle: {
            color: 'black'
        },
        legend: {
            textStyle: {
                color: 'green'
            }
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('pov_chart'));
    chart.draw(data, options);
}
