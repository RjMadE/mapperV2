// File: static/iconControl.js

// Define initial position for the icon (somewhere in the UK)
var iconLat = 51.5154;  // Paddington Station Latitude
var iconLng = -0.1754;  // Paddington Station Longitude

// Create a custom icon
var customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Example icon URL
    iconSize: [25, 41],  // Size of the icon
    iconAnchor: [12, 41]  // Anchor point of the icon (centered at the bottom)
});

// Add the icon to the map
var iconMarker = L.marker([iconLat, iconLng], { icon: customIcon }).addTo(map);

// Function to determine which cell the given latitude and longitude falls into
function getCell(lat, lng) {
    var stepLat = 0.00001;  // Latitude step for the grid
    var stepLng = 0.00001;  // Longitude step for the grid
    var latIndex = Math.floor(lat / stepLat);
    var lngIndex = Math.floor(lng / stepLng);
    return { latIndex: latIndex, lngIndex: lngIndex };
}

// Function to handle arrow key events and move the icon
function moveIcon(event) {
    var moveStep = 0.00001;  // Define how far the icon moves on each key press

    switch (event.key) {
        case "ArrowUp":
            iconLat += moveStep;  // Move north
            break;
        case "ArrowDown":
            iconLat -= moveStep;  // Move south
            break;
        case "ArrowLeft":
            iconLng -= moveStep;  // Move west
            break;
        case "ArrowRight":
            iconLng += moveStep;  // Move east
            break;
        default:
            return;  // Ignore other keys
    }

    // Update the position of the icon marker
    iconMarker.setLatLng([iconLat, iconLng]);

    // Get the current cell coordinates
    var currentCell = getCell(iconLat, iconLng);

    // Update the cell coordinates display
    var cellInfoElement = document.getElementById('cell-coordinates');
    cellInfoElement.innerText = `Latitude Index: ${currentCell.latIndex}, Longitude Index: ${currentCell.lngIndex}`;
}

// Add an event listener for the 'keydown' event to capture arrow key presses
document.addEventListener('keydown', moveIcon);
