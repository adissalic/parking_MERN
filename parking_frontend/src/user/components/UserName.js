import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import classes from "./UserName.module.css";
import { AuthContext } from "../../context/auth-context";

const UserName = () => {
  const { sendRequest } = useHttpClient();
  const [loadedName, setLoadedName] = useState();

  const auth = useContext(AuthContext);
  useEffect(() => {
    const fetchName = async () => {
      try {
        const responseData = await sendRequest(
          `https://parking-backend-06pc.onrender.com/api/users/${auth.userId}`
        );
        setLoadedName(responseData.user.name);
      } catch (err) {}
    };
    fetchName();
  }, [sendRequest, loadedName, auth.token, auth.userId]);
  return <p className={classes.userName}>Dobar dan! {loadedName}</p>;
};

export default UserName;
