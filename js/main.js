// assign the access token
mapboxgl.accessToken =
    'pk.eyJ1IjoiY3phaG4yIiwiYSI6ImNsczNuODdlZTBvNXQyaXBidXZpZXdiamUifQ.VVwXh_XspA4FJt3D-mS7og';

// declare the map object
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 6, // starting zoom
    minZoom: 1,
    center: [-123, 47] // starting center
});

// declare the coordinated chart as well as other variables.
let graduationChart = null,
    rate = {},
    numTracts = 0;

// create a few constant variables.
const grades = [2, 5, 10, 20],
    colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)', 'rgb(19,102,51)'],
    radii = [1, 2, 5, 10];



// define the asynchronous function to load geojson data.
async function geojsonFetch() {

    // Await operator is used to wait for a promise.
    // An await can cause an async function to pause until a Promise is settled.
    let response;
    response = await fetch('assets/diplomadatacentroids.geojson');
    gradrates = await response.json();

    gradrates.features = gradrates.features.filter(feature => {
        return feature.properties.pctnodiploma !== undefined;
    });


    let response2;
    response2 = await fetch('assets/incomedata.geojson');
    pov_data = await response2.json();


    pov_data.features.forEach(feature => {
        feature.properties.S1902_C03_001E = parseFloat(feature.properties.S1902_C03_001E);
    });




     //load data to the map as new layers.
    //map.on('load', function loadingData() {
        map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

            // when loading a geojson, there are two steps
            // add a source of the data and then add the layer out of the source
            map.addSource('gradrates', {
                type: 'geojson',
                data: gradrates
            });

            map.addSource('pov_data', {
                type: 'geojson',
                data: pov_data,
                generateId: true
            });

            map.addLayer({
                'id': 'pov_data_layer',
                'type': 'fill',
                'source': 'pov_data',
                'paint': {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'S1902_C03_001E'],
                        20000, '#eff3ff', // Lightest blue
                        40000, '#bdd7e7',
                        60000, '#6baed6',
                        80000, '#3182bd',
                        100000, '#08519c',
                        120000, '#084594' // Darkest blue
                    ],
                    'fill-opacity': 0.9 // Increase opacity for better visibility
                }
            });

            map.addLayer({
                'id': 'pov_data_line',
                'type': 'line',
                'source': 'pov_data',
                'paint': {
                    'line-color': '#ffffff', // White outline for better contrast
                    'line-width': .5,
                }
            });

            map.addLayer({
                'id': 'gradrates-point',
                'type': 'circle',
                'source': 'gradrates',
                'minzoom': 2,
                'paint': {
                    'circle-radius': {
                        'property': 'pctnodiploma',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]],
                            [grades[3], radii[3]]
                        ]
                    },
                    'circle-color': '#31a354', // Green color for the proportional symbols
                    'circle-stroke-color': '#ffffff', // White outline for better contrast
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6 // Reduce opacity for better contrast
                }
            });





        // click on each dot to view magnitude in a popup
        map.on('click', 'gradrates-point', (event) => {

            const pctnodiploma = event.features[0].properties.pctnodiploma;
            new mapboxgl.Popup()
                .setLngLat(event.features[0].geometry.coordinates)
                .setHTML(`<strong>Percent Without Diploma: </strong> ${pctnodiploma}<strong>%</strong>`)
                .addTo(map);
        });

        // create the legend object and anchor it to the html element with id legend.
const legend = document.getElementById('legend');

//set up legend grades content and labels
let labels = ['<strong>Percent Without Diploma</strong>'], vbreak;

//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');

}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://geo.wa.gov/datasets/d4a6f3c1a45d48b9b31de9ebaf5af4ee_0/explore?location=47.237631%2C-120.811974%2C8.00">Washington Geospatial Open Data Portal</a></p>';

// join all the labels and the source to create the legend content.
legend.innerHTML = labels.join('') + source;


// THIS SECTION IS FOR THE BAR CHART
        // the coordinated chart relevant operations

        // found the the magnitudes of all the earthquakes in the displayed map view.
        pctgradrates = calDiplomas(gradrates, map.getBounds());

        // enumerate the number of census tracts.
        numTracts = pctgradrates[2] + pctgradrates[5] + pctgradrates[10] + pctgradrates[20];

        // update the content of the element earthquake-count.
        document.getElementById("census-count").innerHTML = numTracts;

        // add "mag" to the beginning of the x variable - the magnitude, and "#" to the beginning of the y variable - the number of earthquake of similar magnitude.
        x = Object.keys(pctgradrates);
        x.unshift("pctnodiploma")
        y = Object.values(pctgradrates);
        y.unshift("#")


        // generate the chart
        graduationChart = c3.generate({
            size: {
                height: 200,
                width: 450
            },
            data: {
                x: 'pctnodiploma',
                columns: [x, y],
                type: 'bar', // make a bar chart.
                colors: {
                    '#': (d) => {
                        return colors[d["x"]];
                    }
                },
                onclick: function (d) { // update the map and sidebar once the bar is clicked.
                    let floor = parseInt(x[1 + d["x"]]),
                        ceiling = floor + 1;
                    // combine two filters, the first is ['>=', 'mag', floor], the second is ['<', 'mag', ceiling]
                    // the first indicates all the earthquakes with magnitude greater than floor, the second indicates
                    // all the earthquakes with magnitude smaller than the ceiling.
                    map.setFilter('gradrates-point',
                        ['all',
                            ['>=', 'pctnodiploma', floor],
                            ['<', 'pctnodiploma', ceiling]
                        ]);
                }
            },
            axis: {
                x: { //magnitude
                    type: 'category',
                },
                y: { //count
                    tick: {
                        values: [100, 200, 300, 400, 500]
                    }
                }
            },
            legend: {
                show: false
            },
            bindto: "#gradrate-chart" //bind the chart to the place holder element "gradrates-chart".
        });

    });



    //load data to the map as new layers.
    //map.on('load', function loadingData() {
    map.on('idle', () => { //simplifying the function statement: arrow with brackets to define a function

        pctgradrates = calDiplomas(gradrates, map.getBounds());
        numTracts = pctgradrates[2] + pctgradrates[5] + pctgradrates[10] + pctgradrates[20];
        document.getElementById("census-count").innerHTML = numTracts;


        x = Object.keys(pctgradrates);
        x.unshift("pctnodiploma")
        y = Object.values(pctgradrates);
        y.unshift("#")

        // after finishing each map reaction, the chart will be rendered in case the current bbox changes.
        graduationChart.load({
            columns: [x, y]
        });
    });
}

// call the geojson loading function
geojsonFetch();

function calDiplomas(currentGradRates, currentMapBounds) {

    let ratesClasses = {
        2: 0,
        5: 0,
        10: 0,
        20: 0
    };
    currentGradRates.features.forEach(function (d) { // d indicate a feature of currentEarthquakes
        // contains is a spatial operation to determine whether a point within a bbox or not.
        if (currentMapBounds.contains(d.geometry.coordinates)) {
            // if within, the # of the earthquake in the same magnitude increase by 1.
            let percent = d.properties.Percent_Without_Diploma;
            let roundedPercent = roundToNearest(percent, Object.keys(ratesClasses));
            ratesClasses[roundedPercent] += 1;
        }

    })
    console.log(ratesClasses);
    return ratesClasses;
}

function roundToNearest(number, values) {
    let nearest = values.reduce(function(prev, curr) {
        return (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev);
    });
    return nearest;
}

// capture the element reset and add a click event to it.
const reset = document.getElementById('reset');
reset.addEventListener('click', event => {

    // this event will trigger the map fly to its origin location and zoom level.
    map.flyTo({
        zoom: 6,
        center: [-123, 47]
    });
    // also remove all the applied filters
    map.setFilter('gradrates-point', null)


});

// Inside the geojsonFetch() function

// Define your legend layers and colors