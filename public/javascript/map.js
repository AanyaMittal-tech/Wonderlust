mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(coordinates);
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates) //Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h6>${listing.title}</h6><p>Exact location will be provided after booking!</p>`
        )
    )
    .addTo(map);
