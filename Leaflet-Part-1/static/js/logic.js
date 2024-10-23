// Initialize the map centered at an average global location
var map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tile layer as the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data from USGS for the past week

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// Function to set marker color based on earthquake depth
function getColor(depth) {
    return depth > 50 ? 'red' :
           depth > 30 ? 'orange' :
           depth > 10 ? 'yellow' : 'green';
} 

// Function to set marker size based on earthquake magnitude
function getRadius(magnitude){
    return magnitude * 4;
}

// Fetch and plot the earthquake data
fetch(url).then(response => response.json())
           .then(data => {
                data.features.forEach(feature => {
                    var coords = feature.geometry.coordinates;
                    var magnitude = feature.properties.mag;
                    var depth = coords[2];
                    var latlng = [coords[1], coords[0]];

                    // Add a circle marker for each earthquake
                    L.circleMarker(latlng,{
                        radius: getRadius(magnitude),
                        color: getColor(depth),
                        fillOpacity: 0.7,
                        weight: 0,
                        stroke: false
                    })
                    .bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
                                <strong>Magnitude:</strong> ${magnitude}<br>
                                <strong>Depth:</strong> ${depth} km`)
                                .addTo(map);
                });
           });

// Add a legend to the map to explain color coding for depth
var legend = L.control({postion: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 30, 50],
    labels = [];

    div.innerHTML += '<h4>Depth Legend</h4>';
    // Loop through depth intervals to create a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '; width: 16px; height: 16px; display: inline-block; margin-right: 6px;"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
    }
    
    return div;
};

legend.addTo(map);
