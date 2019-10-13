// Imports
//////////

// JS
import L from "leaflet";
import axios from "axios";
import { getDistance } from 'geolib';
import { makeItemDraggable } from "./utils/utils";

// CSS
import '../styles/index.scss';
import "leaflet/dist/leaflet.css";

// Markers
import { greenMarker, violetMarker, orangeMarker } from "./markers";


// Map Initialization
/////////////////////

let map = L.map('map', {
    center: [51.05, 3.71667],
    zoom: 10
});

// Add a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/alingenomen/cjp9uuri70bd42so6ig01u0gx/tiles/256/{z}/{x}/{y}' +
    '?access_token=pk.eyJ1IjoiYWxpbmdlbm9tZW4iLCJhIjoiY2pwOXR3NjJkMmVpZzNrb2JxZG94YXhxaCJ9.N451yUC4aWBcnTxGi3o8dA',
    {attribution: 'Hondentoiletten - Frontend Developer Syntra, jaar 2 - Dzengiz Tafa'
}).addTo(map);


// Functionality
////////////////

// Variables
let toiletCoordinates = [];
let toilets = [];


/**
 * Helper functions
 ***/

// Functionality to toggle a marker with a certain color
const toggleColor = (index, color) => {
    const markerToUse = (color === 'green')
        ? greenMarker : orangeMarker;
    toilets[index].marker.setIcon(markerToUse);
};

// Functionality to locate the user & pan
const locateAndPan = (latitude, longitude) => {
    L.marker([latitude, longitude]).addTo(map);
    map.panTo(new L.LatLng(latitude, longitude));
};

// Functionality to calculate distance & create objects to work with
const calculateDistAndGenerateObj = (latitude, longitude) => {
    toiletCoordinates.forEach((toilet, index) => {
        const distance = getDistance([latitude, longitude], [toilet[1], toilet[0]]);

        // Generate a new object
        const newToilet = {
            distance: distance,
            name: `locatie ${index}`,
            coordinates: toilet
        };

        toilets.push(newToilet);
    });
};

// Functionality to sort the toilets
const sortToilets = () => {
    toilets.sort((a, b) => {
        if(a.distance > b.distance) { return 1; }
        if(a.distance < b.distance) { return -1; }
        return 0;
    });
};

// Functionality to generate all the markers & HTML
const generateMarkersAndHTML = () => {
    // Fetch the infoDiv
    const info = document.getElementById('locations');
    // Make the infoDiv draggable
    makeItemDraggable(info);

    const locationInfoDiv = document.getElementById('locationInfo');

    // Put green markers for the nearest 5 locations & put them in the infoDiv
    for (let i = 0; i < 5; i++) {
        // Create an infoDiv to fill with data & add eventlisteners for mouseover & mouseleave
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('infoItem');
        infoDiv.addEventListener("mouseover", () => toggleColor(i, 'orange'));
        infoDiv.addEventListener("mouseleave",() => toggleColor(i, 'green'));

        // Fill the div with its contents
        infoDiv.innerHTML = (
            `
                <div class="infoItem">
                    <h3>Locatie ${i+1}</h3>
                    <h4>Afstand: ${toilets[i].distance/1000}km</h4> 
                    <p>Lat: ${toilets[i].coordinates[1]} <br> Lon: ${toilets[i].coordinates[0]}</p>
                    
                </div>
            `
        );

        // Add the div to the target
        locationInfoDiv.appendChild(infoDiv);

        // Add a marker & add it to an array of the nearest toilets
        toilets[i].marker = L.marker([toilets[i].coordinates[1], toilets[i].coordinates[0]], {icon: greenMarker}).addTo(map);
    }

    // Generate violet markers for the rest
    for (let i = 5; i < toilets.length; i++) {
        toilets[i].marker = L.marker([toilets[i].coordinates[1], toilets[i].coordinates[0]], {icon: violetMarker}).addTo(map);
    }
};


/**
 * End of helper functions
 **/

// Get all the dog toilets in Ghent & create a marker for each one
axios.get('https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson')
    .then(res => {

        // Loop through the coordinates & save them in an array
        res.data.coordinates.forEach(coordinate => {
            toiletCoordinates.push(coordinate);
        });

        // Ask for the user's location
        navigator.geolocation.getCurrentPosition(position => {

            // Fetch the latitude & longitude out of the coords
            const { latitude, longitude } = position.coords;

            // Visualise the user's location & pan to its location
            locateAndPan(latitude, longitude);

            // Loop through all the toilets & calculate the distance from you
            calculateDistAndGenerateObj(latitude, longitude);

            // // Sort the toilets by distance, ascending
            sortToilets();

            // Generate markers & html markup
            generateMarkersAndHTML();
        });
    });





