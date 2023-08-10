import React, { useContext, useEffect, useState } from "react";
import classes from "./PayButton.module.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";

const PayButton = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [body, isBody] = useState("Unesite Vaše registarske oznake");
  const [numH, isNumHourly] = useState(12);
  const [numD, isNumDaily] = useState(15);
  const [place, isPlace] = useState("");

  useEffect(() => {
    isPlace(props.name);
    if (localStorage.getItem("Plate")) {
      isBody(localStorage.getItem("Plate"));
    }
    if (props.zone === 0) {
      isNumHourly(10);
      isNumDaily(13);
    }
    if (props.zone === 1) {
      isNumHourly(11);
      isNumDaily(14);
    }
    if (props.zone === 2) {
      isNumHourly(12);
      isNumDaily(15);
    }
  }, [props]);

  const placeSubmitHandler = async (cost) => {
    try {
      await sendRequest(
        `http://localhost:5500/api/payments/${auth.userId}`,
        "POST",
        JSON.stringify({
          id: props.id,
          name: props.name,
          zone: props.zone,
          plate: body,
          price: cost,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
  };
  const payHour = () => {
    if (auth.userId) {
      placeSubmitHandler(props.price);
    } else console.log("You payed 1h");
  };
  const payDay = () => {
    if (auth.userId) {
      placeSubmitHandler(props.daily);
    } else console.log("You payed 1 day");
  };
  return (
    <div className={classes.pay}>
      <h3>{place}</h3>
      <p>Zona: {props.zone}</p>
      {props.zone !== 3 && (
        <>
          <p>1 SAT</p>
          <Link
            to={"sms:+3878335" + numH + ";?&body=" + body}
            onClick={payHour}
          >
            Plati: {props.price} KM
          </Link>
          <p>DAN</p>
          <Link to={"sms:+3878335" + numD + ";?&body=" + body} onClick={payDay}>
            Plati {props.daily} KM
          </Link>
        </>
      )}
      {props.zone === 3 && <p>Plaćanje na rampi (00-24)</p>}
    </div>
  );
};

export default PayButton;
