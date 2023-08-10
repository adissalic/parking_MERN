import React from "react";
import Map from "../components/Map";
import { useLoadScript } from "@react-google-maps/api";
import classes from "./MapPage.module.css"

const MapPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCVHavRJSM1laJz-1XVJ93-IliSBbIWR1E", // Add your API key
  });
  return (
    <div className="main">
      <p className="title">Parking lokacije</p>
      <div className={classes.options}>
        {isLoaded ? <Map className="mapa" /> : "Loading Google Map"}
      </div>
    </div>
  );
};

export default MapPage;
