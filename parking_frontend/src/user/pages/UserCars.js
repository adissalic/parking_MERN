import React, { useContext, useEffect, useState } from "react";

import { useHttpClient } from "../../hooks/http-hook";
import LoadingSpinner from "../components/LoadingSpinner";

import classes from "./UserCars.module.css";
import { AuthContext } from "../../context/auth-context";
import Input from "../components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../util/validators";
import Button from "../components/FormElements/Button";
import { useForm } from "../../hooks/form-hook";

const UserCars = () => {
  const auth = useContext(AuthContext);
  const [popup, setPopup] = useState(false);
  const [loadedCars, setLoadedCars] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      plate: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const userDataString = localStorage.getItem("userData");
  const userDataObject = JSON.parse(userDataString);
  const userId = userDataObject.userId;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          `https://parking-backend-06pc.onrender.com/api/cars/user/${userId}`,
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
    setFormData(formState.inputs);
    // eslint-disable-next-line
  }, [sendRequest, userId, popup]);

  const handleDelete = async (carId) => {
    try {
      await sendRequest(
        `https://parking-backend-06pc.onrender.com/api/cars/${carId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      // Update state by filtering out the deleted car
      setLoadedCars((prevCars) => prevCars.filter((car) => car._id !== carId));
    } catch (err) {
      // Handle error
    }
  };

  const carSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `https://parking-backend-06pc.onrender.com/api/cars/${userId}`,
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          plate: formState.inputs.plate.value,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setPopup(false);
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <div className="main">
        <p className="title">Vaš Parking</p>
        <h3 className="heading">Spisak vozila</h3>
        <div className={classes.options + " options"}>
          {loadedCars.map((cars) => (
            <div key={cars._id} className={classes.plates}>
              <button className={classes.car}>
                {cars.name}
                <br></br> {cars.plate}
              </button>
              <button
                className={classes.delete}
                onClick={() => handleDelete(cars._id)} // Attach the delete function to the button
              >
                X
              </button>
            </div>
          ))}
          <button className={classes.add} onClick={() => setPopup(true)}>
            Dodaj
          </button>
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
      {popup && (
        <div className={classes.addingCars}>
          <h4> Dodaj vozilo</h4>
          <form className={classes.wrapper} onSubmit={carSubmitHandler}>
            <Input
              id="name"
              element="input"
              type="text"
              label="Naziv vozila"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Unesite naziv vozila"
              onInput={inputHandler}
            />

            <Input
              id="plate"
              element="input"
              label="Registarske oznake"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Unesite registarske oznake"
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              Dodaj
            </Button>
            <p onClick={() => setPopup(false)}>Odustani</p>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserCars;
