// // Load Google Charts library API and corechart package
// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);
// // Function to draw the chart
// function drawChart() {

//     fetch('assets/diploma_data.geojson')
//         .then(response => response.json())
//         .then(data => {

//             var chartData = new google.visualization.DataTable();
//             chartData.addColumn('number', 'Population_over24');
//             chartData.addColumn('number', 'Percent_without_diploma');



//             data.features.forEach(feature => {
//                 chartData.addRow([
//                     feature.properties.Population_Over24,
//                     parseFloat(feature.properties.Percent_Without_Diploma)
//                 ]);
//             });

//             var options = {
//                 width: 250,
//                 height: 200,
//                 title: 'Population Over 24 vs. Percent Without Diploma',
//                 hAxis: {
//                     title: 'Population Over 24',
//                     minValue: 0,

//                     viewWindow: {
//                         max: 12000
//                     },
//                 },
//                 vAxis: {
//                     title: 'Percent Without Diploma',
//                     minValue: 0,
//                     maxValue: 100},
//                 legend: 'none'
//             };
//             console.log(options)
//             var chart = new google.visualization.ScatterChart(document.getElementById('diploma_chart'));
//             chart.draw(chartData, options);
//         })
//         .catch(error => console.error('Error loading data:', error));
// }

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    fetch('assets/incomedata.geojson')
    .then(response => response.json())
    .then(data => {
       
        const meanIncomes = data.features.map(feature => feature.properties.S1902_C03_001E);

   
        const below40000 = meanIncomes.filter(income => income < 40000).length;
        const between40000and60000 = meanIncomes.filter(income => income >= 40000 && income < 60000).length;
        const between60000and80000 = meanIncomes.filter(income => income >= 60000 && income < 80000).length;
        const between80000and100000 = meanIncomes.filter(income => income >= 80000 && income < 100000).length;
        const above100000 = meanIncomes.filter(income => income >= 100000).length;

    
        const totalCensusTracts = meanIncomes.length;
        const percentageBelow40000 = (below40000 / totalCensusTracts) * 100;
        const percentageBetween40000and60000 = (between40000and60000 / totalCensusTracts) * 100;
        const percentageBetween60000and80000 = (between60000and80000 / totalCensusTracts) * 100;
        const percentageBetween80000and100000 = (between80000and100000 / totalCensusTracts) * 100;
        const percentageAbove100000 = (above100000 / totalCensusTracts) * 100;

  
        const chartData = google.visualization.arrayToDataTable([
            ['Income Range', 'Percentage'],
            ['Below $40,000', percentageBelow40000],
            ['$40,000 - $60,000', percentageBetween40000and60000],
            ['$60,000 - $80,000', percentageBetween60000and80000],
            ['$80,000 - $100,000', percentageBetween80000and100000],
            ['Above $100,000', percentageAbove100000]
        ]);


   

    var options = {
        title: '% of Households by Income Level',
        is3D: true,
        backgroundColor: 'transparent',
        titleTextStyle: {
            color: 'black'
        },
        legend: {
            textStyle: {
                color: 'green'
            }
        },
        width:500,
        height: 300,
        chartArea: { left: '30%', width: '70%' },
        colors: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#084594'],
        pieSliceText: 'Percentage',
        pieSliceTextStyle: {
            color: 'black'
        }
    };

 
    const chart = new google.visualization.PieChart(document.getElementById('pov_chart'));
    chart.draw(chartData, options);
})
.catch(error => {
    console.error('Error fetching or processing data:', error);
});
}