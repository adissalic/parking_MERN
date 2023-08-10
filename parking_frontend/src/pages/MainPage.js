import React from "react";
import register from "../assets/register.png";
import login from "../assets/login.png";
import mapa from "../assets/map.png";
import pay from "../assets/pay.png";
import { Link } from "react-router-dom";
import classes from "./MainPage.module.css"

const MainPage = () => {
  return (
    <div className={classes.main}>
      <p className={classes.title}>Dobrodošli!</p>
      <div className={classes.options}>
        <Link to="/register">
          <h4>REGISTRUJ SE</h4>
          <img src={register} alt="reg" />
        </Link>
        <Link to="/map">
          <h4>MAPA</h4>
          <img src={mapa} alt="map" />
        </Link>
        <Link to="/login">
          <h4>PRIJAVA</h4>
          <img src={login} alt="login" />
        </Link>
        <Link to="/fastpay">
          <h4>BRZO PLAĆANJE</h4>
          <img src={pay} alt="fast pay" />
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
