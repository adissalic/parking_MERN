import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import classes from "./MainMenu.module.css";
import { AuthContext } from "../../context/auth-context";

const MainMenu = () => {
  const auth = useContext(AuthContext);
  const [menu, setMenu] = useState(false);

  const logOut = () => {
    auth.logout();
  };
  const openMenu = () => {
    setMenu((prev) => !prev);
  };

  return (
    <div className={classes.dots}>
      <div className={classes.open} onClick={openMenu}>
        ...
      </div>
      <nav
        className={
          (menu ? classes.navOpen : classes.navClose) + " " + classes.nav
        }
      >
        <button onClick={openMenu} className={classes.close}>
          X
        </button>
        <div onClick={openMenu} className={classes.wrapper}>
          <Link to="/account">Račun</Link>
          <div className={classes.list}>
            <Link to="/">Početna stranica</Link>
            <Link to="/carslist">Spisak vozila</Link>
            <Link to="/payments">Plaćanja</Link>
            <Link to="/locations-list">Spisak lokacija</Link>
          </div>
          <Link onClick={logOut} className={classes.logout}>
            odjava
          </Link>
        </div>
      </nav>
    </div>
  );
};
export default MainMenu;
