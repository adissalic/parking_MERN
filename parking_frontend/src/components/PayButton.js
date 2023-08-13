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
    const [toPay, setToPay] = useState();
    const [loadedCars, setLoadedCars] = useState([]);

  useEffect(() => {
    isPlace(props.name);
    if (localStorage.getItem("Plate") && !auth.userId) {
      isBody(localStorage.getItem("Plate"));
    } else {
      const fetchCars = async () => {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BASE_URL}cars/user/${auth.userId}`,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          setLoadedCars(responseData.cars);
        } catch (err) {}
      };
      fetchCars();
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
    // eslint-disable-next-line
  }, [props, auth.userId]);

  const carPayment = async (plate) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE_URL}payments/${auth.userId}`,
        "POST",
        JSON.stringify({
          id: props.id,
          name: props.name,
          zone: props.zone,
          plate: plate,
          price: toPay,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
  };

  const carPay = (plate) => {
    carPayment(plate);
  };


  return (
    <div className={classes.pay}>
      <h3>{place}</h3>
      <p>Zona: {props.zone}</p>
      {!auth.userId && props.zone !== 3 && (
        <>
          <p>1 SAT</p>
          <Link to={"sms:+3878335" + numH + ";?&body=" + body}>
            Plati: {props.price} KM
          </Link>
          <p>DAN</p>
          <Link to={"sms:+3878335" + numD + ";?&body=" + body}>
            Plati {props.daily} KM
          </Link>
        </>
      )}
      {auth.userId && (
        <React.Fragment>
          <button
            className={classes.butt}
            onClick={() => setToPay(props.price)}
          >
            <Link className={classes.link}>{props.price} KM /1h</Link>
          </button>

          <button
            className={classes.butt}
            onClick={() => setToPay(props.daily)}
          >
            <Link className={classes.link}>{props.daily} KM /dan</Link>
          </button>
        </React.Fragment>
      )}
      {toPay && <h4 className={classes.title}>Izaberite vozilo:</h4>}
      {toPay && loadedCars.length === 0 ? (
        <button className={classes.butt}>
          {" "}
          <Link to="/carslist" className={classes.link}>
            Dodajte vozilo
          </Link>
        </button>
      ) : (
        ""
      )}
      {toPay &&
        loadedCars.map((cars) => (
          <button
            key={cars._id}
            className={classes.butt}
            onClick={() => carPay(cars.plate)}
          >
            <Link
              className={classes.link}
              to={"sms:+3878335" + numH + ";?&body=" + cars.plate}
            >
              {cars.name} - ({cars.plate})
            </Link>
          </button>
        ))}
      {props.zone === 3 && <p>Plaćanje na rampi (00-24)</p>}
    </div>
  );
};

export default PayButton;
