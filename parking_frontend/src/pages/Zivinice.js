import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const Zivinice = () => {
  const [text, setText] = useState("Unesite vaše registarske oznake");

  useEffect(() => {
    if (localStorage.getItem("Plate")) {
      setText(localStorage.getItem("Plate"));
    }
  }, [text]);

  return (
    <div className="main">
      <p className="title">ŽIVINICE</p>
      <h4>1 SAT</h4>
      <div className=" options">
        <Link to={"sms:+387833508;?&body=" + text}>ZONA 2</Link>
        <Link to={"sms:+387833509;?&body=" + text}>ZONA 3</Link>
      </div>
    </div>
  );
};
export default Zivinice;
