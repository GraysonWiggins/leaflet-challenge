const geoJSONLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Step 1: Use D3 to fetch the GeoJSON data
d3.json(geoJSONLink)
  .then(function(data) {
    createMap(data);
  });

// Step 2: Create a Leaflet map
function createMap(data) {
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

  // Step 3: Add a base tile layer from OpenStreetMap to the map
  L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(myMap);

  // Step 4: Add a GeoJSON layer to the map
  addGeoJSONLayer(data, myMap);
}

// Step 4: Add a GeoJSON layer to the map
function addGeoJSONLayer(data, map) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      let radius = feature.properties.mag * 5;
      let depth = feature.geometry.coordinates[2];
      let color = getColor(depth);

      return L.circleMarker(latlng, {
        radius: radius,
        fillColor: color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map);

  // Step 5: Create a legend
  createLegend(map);

}

// Step 5: Create a legend
function createLegend(map) {
    let legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
            let depths = [-10, 10, 30, 50, 70, 90];
            let colors = ["#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"];
            let labels = [];
        
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += "<i class='circle' style='background: " + colors[i] + "'></i> " + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        
        console.log(div.innerHTML);
        return div;
    };
    
    legend.addTo(map);
}

// Function to get color based on depth
function getColor(depth) {
  let color;
  if (depth > 90) {
    color = "#800026";
  } else if (depth > 70) {
    color = "#BD0026";
  } else if (depth > 50) {
    color = "#E31A1C";
  } else if (depth > 30) {
    color = "#FC4E2A";
  } else if (depth > 10) {
    color = "#FD8D3C";
  } else {
    color = "#FEB24C";
  }
  return color;
}