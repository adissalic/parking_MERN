import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const Tuzla = () => {
  const [text, setText] = useState("Unesite vaše registarske oznake");

  useEffect(() => {
    if (localStorage.getItem("Plate")) {
      setText(localStorage.getItem("Plate"));
    }
  }, [text]);

  return (
      <div className="main">
        <p className='title'>TUZLA</p>
        <h4>1 SAT</h4>
        <div className="options">
          <Link to={"sms:+387833510;?&body=" + text}>ZONA 0</Link>
          <Link to={"sms:+387833511;?&body=" + text}>ZONA 1</Link>
          <Link to={"sms:+387833512;?&body=" + text}>ZONA 2</Link>
        </div>
        <h4>DNEVNA</h4>
        <div className="options">
          <Link to={"sms:+387833513;?&body=" + text}>ZONA 0</Link>
          <Link to={"sms:+387833514;?&body=" + text}>ZONA 1</Link>
          <Link to={"sms:+387833515;?body=" + text}>ZONA 2</Link>
        </div>
      </div>
  );
};

export default Tuzla;
