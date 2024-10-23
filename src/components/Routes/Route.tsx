"use client";
import { useState, useCallback } from "react";
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 6.9271, // Default center (Sri Lanka)
  lng: 79.8612
};

const RoutePage: React.FC = () => {
  const [locations, setLocations] = useState<string[]>(["", "", "", "", ""]);
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle input change for locations
  const handleInputChange = (index: number, value: string) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = value;
    setLocations(updatedLocations);
  };

  // Handle route calculation
  const calculateRoute = useCallback(() => {
    const [origin, ...destinations] = locations.filter(location => location !== "");

    if (origin && destinations.length >= 1) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination: destinations[destinations.length - 1],
          waypoints: destinations.slice(0, -1).map(location => ({ location, stopover: true })),
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true, // Optimizes the route order
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
            setError(null);
          } else {
            setError("Error calculating directions: " + status);
          }
        }
      );
    } else {
      setError("Please enter at least two locations.");
    }
  }, [locations]);

  return (
    <div>
      <h1>Find Best Route</h1>

      {/* Inputs for 5 locations */}
      {locations.map((location, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Enter Location ${index + 1}`}
            value={location}
            onChange={(e) => handleInputChange(index, e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
      ))}

      <button onClick={calculateRoute}>Find Best Route</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Load Google Map */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          {/* Render Directions */}
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default RoutePage;
