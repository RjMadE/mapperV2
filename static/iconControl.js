// File: static/iconControl.js

// Define initial position for the icon (Paddington Station)
var iconLat = 51.5154;  // Paddington Station Latitude
var iconLng = -0.1754;  // Paddington Station Longitude

// Create a custom icon
var customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Add the icon to the map
var iconMarker = L.marker([iconLat, iconLng], { icon: customIcon }).addTo(map);

// Buffer to store cell coordinates for backend logging
let cellBuffer = [];
const BUFFER_INTERVAL = 5000;  // Log to the backend every 5 seconds

// Function to move the icon and register cells visited
function moveIcon(event) {
    var moveStep = 0.001;  // Define small movement step for precision

    switch (event.key) {
        case "ArrowUp":
            iconLat += moveStep;
            break;
        case "ArrowDown":
            iconLat -= moveStep;
            break;
        case "ArrowLeft":
            iconLng -= moveStep;
            break;
        case "ArrowRight":
            iconLng += moveStep;
            break;
        default:
            return;  // Ignore other keys
    }

    // Update the position of the icon marker
    iconMarker.setLatLng([iconLat, iconLng]);

    // Register the current cell as visited and render it
    visitCell(iconLat, iconLng);

    // Add the current cell to the buffer for backend logging
    var currentCellKey = getCellKey(iconLat, iconLng);
    if (!cellBuffer.includes(currentCellKey)) {
        cellBuffer.push(currentCellKey);
    }

    console.log(`Cell Added to Buffer: ${currentCellKey}`);  // Debugging

    // Update the cell coordinates display
    var cellInfoElement = document.getElementById('cell-coordinates');
    cellInfoElement.innerText = `Cell Key: ${currentCellKey}`;

    // Log buffered cell visits to the backend every BUFFER_INTERVAL
    if (cellBuffer.length === 1) {
        setTimeout(() => {
            if (cellBuffer.length > 0) {
                logCellVisits(cellBuffer);
                cellBuffer = [];  // Clear the buffer after sending
            }
        }, BUFFER_INTERVAL);
    }
}

// Function to log cell visits to the backend
function logCellVisits(buffer) {
    // Convert the buffered cells to unique cell references
    const uniqueCells = [...new Set(buffer)].map(cellKey => {
        const [latIndex, lngIndex] = cellKey.split(',').map(Number);
        return { latIndex, lngIndex };
    });

    console.log(`Sending to Backend: ${JSON.stringify(uniqueCells)}`);  // Debugging

    // Send the unique cells to the backend
    fetch('/log_cell_visit_bulk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uniqueCells)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log(`Logged ${uniqueCells.length} cells to the backend`);
        } else {
            console.error(`Error logging cells: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

// Add an event listener for the 'keydown' event to capture arrow key presses
document.addEventListener('keydown', moveIcon);
