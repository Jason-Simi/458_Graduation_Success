google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['in_poverty', '%'],
          ['Yes',     40.56],
          ['No',      59.44]
        ]);

        var options = {
          title: '% Living in Poverty by Census Tract',
          is3D: true,
          backgroundColor:'lightblue',
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