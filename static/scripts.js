// File: static/scripts.js

// Initialize the map and set the view to the UK
var map = L.map('map').setView([54.5, -4.5], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define step size for the grid
var stepLat = 0.001;
var stepLng = 0.001;

// Maintain a record of all the cells that have been passed through
let allVisitedCells = {};

// Create a layer group to manage all the cells
var cellLayerGroup = L.layerGroup().addTo(map);

// Function to add a cell to visited cells and render it
function visitCell(lat, lng) {
    const cellKey = getCellKey(lat, lng);

    if (!allVisitedCells[cellKey]) {
        allVisitedCells[cellKey] = true;
        
        // Extract latitude and longitude for rendering the rectangle
        let [latIndex, lngIndex] = cellKey.split(',').map(Number);
        let latStart = latIndex * stepLat;
        let lngStart = lngIndex * stepLng;

        // Define the bounds of the new cell
        var cellBounds = [[latStart, lngStart], [latStart + stepLat, lngStart + stepLng]];

        // Create a rectangle to represent the cell
        var gridCell = L.rectangle(cellBounds, {
            color: "red",
            weight: 1,
            fillOpacity: 0.4,
            stroke: false,
        }).addTo(cellLayerGroup);
        
        console.log(`New Cell Visited: ${cellKey}`);  // Debugging
    }
}

// Function to get a unique cell key
function getCellKey(lat, lng) {
    var latIndex = Math.floor(lat / stepLat);
    var lngIndex = Math.floor(lng / stepLng);
    return `${latIndex},${lngIndex}`;
}

// Event listener to handle when the map moves or zooms
map.on('moveend', function () {
    console.log("Map moved, nothing to redraw here with layer group.");  // Debugging
});
