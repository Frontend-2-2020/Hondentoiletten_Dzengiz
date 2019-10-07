// Imports
//////////

// JS
import L from "leaflet";
import axios from "axios";

// CSS
import '../styles/index.scss';
import "leaflet/dist/leaflet.css";


/**
 * Map initialization
 * **/
const map = L.map('map', {
    center: [51.05, 3.71667],
    zoom: 10
});

// Add a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/alingenomen/cjp9uuri70bd42so6ig01u0gx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWxpbmdlbm9tZW4iLCJhIjoiY2pwOXR3NjJkMmVpZzNrb2JxZG94YXhxaCJ9.N451yUC4aWBcnTxGi3o8dA', {
    attribution: 'Hondentoiletten - Frontend Developer Syntra, jaar 2 - Dzengiz Tafa'
}).addTo(map);

/**
 * End of map initialization
 ***/


// Functionality
////////////////

const myIcon = L.icon({
    iconUrl: 'public/img/marker.png',
    iconSize: [32,37],
    iconAnchor: [16,37],
    popupAnchor:[-3,-76]
});

// Get all the dog toilets in Ghent & create a marker for each one
axios.get('https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson')
    .then(res => {
        res.data.coordinates.forEach(coordinate => {
            L.marker([coordinate[1], coordinate[0]], {icon:myIcon}).addTo(map);
        });
    });

// When the user allows geolocation add a marker at its current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        L.marker(
            [position.coords.latitude, position.coords.longitude]).addTo(map);
    });
}




