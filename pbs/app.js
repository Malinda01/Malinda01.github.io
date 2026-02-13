const map = L.map("map").setView([7.8731, 80.7718], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const info = document.getElementById("info");
const drawBtn = document.getElementById("drawBtn");
const resetBtn = document.getElementById("resetBtn");

// ✅ PREDEFINED POINTS (lat, lng)
const points = [
  { name: "Piliyandala", lat: 6.79806, lng: 79.9264 },
  { name: "Colombo", lat: 6.927079, lng: 79.861244 },
  //   { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891 },
  //   { name: "Galle", lat: 6.0535, lng: 80.221 },
];

let markers = [];
let routeLine = null;

function clearAll() {
  markers.forEach((m) => map.removeLayer(m));
  markers = [];
  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }
  info.textContent = "Cleared.";
}

resetBtn.addEventListener("click", clearAll);

function addMarkers() {
  points.forEach((p, i) => {
    const m = L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`${i + 1}. ${p.name}`);
    markers.push(m);
  });
}

async function drawTripOptimized() {
  clearAll();
  addMarkers();

  // OSRM expects lon,lat joined by ;
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");

  const url = `https://routing.openstreetmap.de/trip/v1/driving/${coords}?overview=full&geometries=geojson`;

  info.textContent = "Finding best route order (optimized)...";

  const res = await fetch(url);
  if (!res.ok) {
    info.textContent = "Routing failed. Try again.";
    return;
  }

  const data = await res.json();
  if (!data.trips || data.trips.length === 0) {
    info.textContent = "No trip route found.";
    return;
  }

  const trip = data.trips[0];
  const km = (trip.distance / 1000).toFixed(2);
  const mins = Math.round(trip.duration / 60);

  const latlngs = trip.geometry.coordinates.map(([lon, lat]) => [lat, lon]);

  routeLine = L.polyline(latlngs, { weight: 6 }).addTo(map);
  map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

  info.textContent = `Trip ready ✅ Distance: ${km} km | Time: ~${mins} min`;
}

drawBtn.addEventListener("click", drawTripOptimized);

// optional: draw once automatically
drawTripOptimized();
