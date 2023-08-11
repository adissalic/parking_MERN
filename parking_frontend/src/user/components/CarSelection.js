import React, { useState, useContext, useEffect } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import classes from "./CarSelection.module.css";
import { Link } from "react-router-dom";

const CarSelection = ({ selectedPay, onClose }) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loadedCars, setLoadedCars] = useState([]);
  const [num, isNum] = useState(12);
  const [toPay, setToPay] = useState();

  useEffect(() => {
    if (selectedPay.zone === 0) {
      if (selectedPay.price > 3) {
        isNum(13);
      } else isNum(10);
    }
    if (selectedPay.zone === 1) {
      if (selectedPay.price > 3) {
        isNum(14);
      } else isNum(11);
    }
    if (selectedPay.zone === 2) {
      if (selectedPay.price > 3) {
        isNum(15);
      } else isNum(12);
    }
  }, [selectedPay.zone, selectedPay.plate, selectedPay.price]);

  useEffect(() => {
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
    // eslint-disable-next-line
  }, [auth.userId, onClose]);

  const carPayment = async (plate) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE_URL}payments/${auth.userId}`,
        "POST",
        JSON.stringify({
          id: selectedPay.id,
          name: selectedPay.name,
          zone: selectedPay.zone,
          plate: plate,
          price: toPay,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  const carPay = (plate) => {
    carPayment(plate);
  };
  return (
    <div>
      <div className={classes.car}>
        <div className={classes.wrapper}>
          <h4 className={classes.title}>Plaćanje</h4>
          <p>{selectedPay.name}</p>
          <p>Zona: {selectedPay.zone}</p>
          <button onClick={() => setToPay(selectedPay.price)}>
            <Link className={classes.link}>{selectedPay.price} KM /1h</Link>
          </button>
          {selectedPay.daily && (
            <button onClick={() => setToPay(selectedPay.daily)}>
              <Link className={classes.link}>{selectedPay.daily} KM /dan</Link>
            </button>
          )}
          {toPay && <h4 className={classes.title}>Izaberite vozilo:</h4>}
          {toPay && loadedCars.length === 0 ? (
            <button>
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
                className={classes.plates}
                onClick={() => carPay(cars.plate)}
              >
                <Link
                  className={classes.link}
                  to={"sms:+3878335" + num + ";?&body=" + cars.plate}
                >
                  {cars.name} - ({cars.plate})
                </Link>
              </button>
            ))}
          <div onClick={onClose}>Odustani</div>
        </div>
      </div>
    </div>
  );
};

export default CarSelection;
