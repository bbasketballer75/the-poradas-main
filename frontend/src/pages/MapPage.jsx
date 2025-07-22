
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getMapLocations as getPins } from '../services/api';
import './MapPage.css';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPins();
        setPins(response.data);
      } catch {
        setError('Could not load map pins. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPins();
  }, []);

  // Optionally allow users to add a pin by clicking the map (disabled by default for privacy)
  // const handleMapClick = async (e) => {
  //   const { lat, lng } = e.latlng;
  //   try {
  //     await addPin({ lat, lng });
  //     setSuccess('Your visit has been logged!');
  //     const response = await getPins();
  //     setPins(response.data);
  //   } catch (err) {
  //     setError('Could not log your visit.');
  //   }
  // };

  return (
    <div className="map-page">
      <h2 className="section-title">Visitor Map</h2>
      <p className="subheading">See where our guests are joining from!</p>
      {isLoading ? (
        <div className="loading" role="status" aria-live="polite">Loading map...</div>
      ) : error ? (
        <div className="error-message" role="alert">{error}</div>
      ) : (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          // onClick={handleMapClick}
          className="map-container"
          aria-label="World map showing guest locations"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {pins.length === 0 ? (
            <Popup position={[20, 0]} open={true}>
              No guests have been logged yet.
            </Popup>
          ) : (
            pins.map((pin, idx) => (
              <Marker key={pin._id || idx} position={[pin.lat, pin.lon]}>
                <Popup>
                  <span>
                    Guest from {pin.city ? `${pin.city}, ` : ''}{pin.country || 'Unknown'}
                  </span>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      )}
      {/* {success && <div className="form-success" role="status">{success}</div>} */}
    </div>
  );
};

export default MapPage;