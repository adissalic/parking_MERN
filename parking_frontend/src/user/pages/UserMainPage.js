import React from "react";
import { Link } from "react-router-dom";
import classes from "./UserMainPage.module.css";
import UserName from "../components/UserName";
import LastPayments from "../components/LastPayments";
import PaymentsSum from "../components/PaymentsSum";

const UserMainPage = () => {

  return (
    <div className="main">
      <p className="title">Vaš Parking</p>
      <UserName />
      <h4>Posljednja plaćanja</h4>
      <div className={[classes.options + " options "]}>
       <LastPayments/>
        <Link className={classes.locations} to="/locations-list">
          Spisak lokacija
        </Link>
        <Link className={classes.locations} to="/map">
          Mapa lokacija
        </Link>
        <PaymentsSum />
        <Link to="/payments" > Pregled plaćanja</Link>
      </div>

    </div>
  );
};

export default UserMainPage;
