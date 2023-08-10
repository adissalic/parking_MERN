import React from "react";
import classes from "./Footer.module.css"

const Footer = () => {
  return (
    <p className={classes.footer}>
      mojparking.ba |{" "}
      <a href="mailto:adis.x.design@gmail.com">
        {" "}
        aa design
      </a>
    </p>
  );
};

export default Footer;
