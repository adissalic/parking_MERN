import React from "react";
import classes from "./ErrorPopUp.module.css";

const ErrorPopUp = (props) => {
  return (
    <div className={classes.error}>
        X
      <p>{props.children}</p>
    </div>
  );
};

export default ErrorPopUp;
