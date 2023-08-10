import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import back from "../assets/back.png";
import classes from "./BackDrop.module.css";

const BackDrop = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  const [home, isHome] = useState(true);
  const url = window.location.pathname;
  useEffect(() => {
    if (url === "/") {
      isHome(true);
    } else {
      isHome(false);
    }
  }, [url]);

  if (!home) {
    return (
      <Link onClick={goBack} className={classes.backdrop}>
        <img src={back} alt="back"></img>
      </Link>
    );
  }
};

export default BackDrop;
