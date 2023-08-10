import React, { useState } from "react";
import classes from "./FastPay.module.css";
import { Link } from "react-router-dom";

const FastPay = () => {
  const [open, isOpen] = useState(false);
  const [plate, isPlate] = useState("");

  const openingPlate = () => {
    isOpen(true);
  };
  const cancleEvent = () => {
    isOpen(false);
  };

  const savePlate = (e) => {
    const text = plate.toUpperCase();
    localStorage.setItem("Plate", text);
    alert("Saved " + localStorage.getItem("Plate"));
    isOpen(false);
  };
  return (
    <div className={classes.main + " main"}>
      <p className="title">BRZO PLAĆANJE</p>
      <h4>IZABERI LOKACIJU</h4>
      <div className={classes.options + " options"}>
        <Link to="/tuzla">Tuzla</Link>
        <Link to="/zivinice">Živinice</Link>
      </div>
      {open ? (
        <>
          <input
            placeholder="Unesi npr. A12-B-123"
            onChange={(e) => isPlate(e.target.value)}
          ></input>{" "}
          <button onClick={savePlate}>Spremi</button>
          <button onClick={cancleEvent}>Odustani</button>
        </>
      ) : (
        <button onClick={openingPlate}>Spremi registarske oznake?</button>
      )}
    </div>
  );
};

export default FastPay;
