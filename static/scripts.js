// File: static/scripts.js

// Initialize the map and set the view to the UK
var map = L.map('map').setView([54.5, -4.5], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define the step size for the virtual grid
var stepLat = 0.00001;  // Latitude step for the grid
var stepLng = 0.00001;  // Longitude step for the grid

// Track the user's current cell
var currentCell = { latIndex: null, lngIndex: null };

// Function to determine which cell the given latitude and longitude falls into
function getCell(lat, lng) {
    var latIndex = Math.floor(lat / stepLat);
    var lngIndex = Math.floor(lng / stepLng);
    return { latIndex: latIndex, lngIndex: lngIndex };
}

// Function to handle user movement and update cell tracking
function onMapMouseMove(e) {
    // Get the latitude and longitude from the event
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Determine which cell the user is in
    var newCell = getCell(lat, lng);

    // Check if the user has moved to a different cell
    if (newCell.latIndex !== currentCell.latIndex || newCell.lngIndex !== currentCell.lngIndex) {
        currentCell = newCell;
        console.log(`User moved to cell: Latitude Index ${currentCell.latIndex}, Longitude Index ${currentCell.lngIndex}`);
        
        // Here you can add logic to track the route or store the cell data
    }
}

// Attach the mouse move event to track user's movement across the map
map.on('mousemove', onMapMouseMove);
