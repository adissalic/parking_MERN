import React, { useContext, useEffect, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import PayButton from "./PayButton";
import classes from "./Map.module.css";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";

function Map() {
  const auth = useContext(AuthContext);
  const [markers, setLoadedMarkers] = useState([]);
  const { sendRequest } = useHttpClient();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [currentPosition, setPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const [clickLocation, isClicked] = useState();
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });
  const icon = {
    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  };

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return null;
    }
    setActiveMarker(marker);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}places/`
        );
        setLoadedMarkers(responseData.place);
        setMapLoaded(true);
      } catch (err) {}
    };
    fetchPlaces();
    navigator.geolocation.getCurrentPosition(function (position) {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [
    currentPosition.lat,
    currentPosition.lng,
    zoom,
    center,
    sendRequest,
    auth,
  ]);

  const handleOnLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };
  const showMyLocation = () => {
    if (currentPosition.lat === 0) {
      alert("Enable location first");
    } else {
      isClicked(
        <MarkerF
          key={currentPosition.lat}
          position={currentPosition}
          options={{
            zIndex: 999,
            icon: icon,
          }}
        ></MarkerF>
      );
      setZoom(15);
      setCenter(currentPosition);
      setActiveMarker(null);
    }
  };
  return (
    <React.Fragment>
      {mapLoaded && (
        <GoogleMap
          onLoad={handleOnLoad}
          onClick={() => setActiveMarker(null)}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
          >
          {markers.map(({ id, name, position, zone, price, daily }) => (
            <MarkerF
              key={id}
              position={position}
              onClick={() => handleActiveMarker(id)}
            >
              {activeMarker === id && (
                <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                  <div>
                    <PayButton
                      id={id}
                      name={name}
                      zone={zone}
                      price={price}
                      daily={daily}
                    />
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
          {!currentPosition.lat !== 0 && (
            <div className={classes.MyLocation} onClick={showMyLocation}>
              Find my location
            </div>
          )}
          {clickLocation}
        </GoogleMap>
      )}
    </React.Fragment>
  );
}

export default Map;
