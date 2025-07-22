import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getPins, addPin } from '../services/api';
import './MapPage.css';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      const response = await getPins();
      setPins(response.data);
    };
    fetchPins();
  }, []);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    await addPin({ lat, lng });
    const response = await getPins();
    setPins(response.data);
  };

  return (
    <div className="map-page">
      <h2 className="section-title">Visitor Map</h2>
      <p className="subheading">See where our guests are joining from!</p>
      <MapContainer center={[20, 0]} zoom={2} onClick={handleMapClick} className="map-container">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {pins.map((pin) => (
          <Marker key={pin._id} position={[pin.lat, pin.lng]}>
            <Popup>A guest is here!</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;