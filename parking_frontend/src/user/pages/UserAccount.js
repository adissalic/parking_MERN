import React, { useContext } from "react";

import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import { useForm } from "../../hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators";

import Button from "../components/FormElements/Button";
import Input from "../components/FormElements/Input";
import LoadingSpinner from "../components/LoadingSpinner";

import classes from "./UserAccount.module.css";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: true,
      },
      email: {
        value: "",
        isValid: true,
      },
      password: {
        value: "",
        isValid: true,
      },
    },
    false
  );
const navigate = useNavigate()
  const userDataString = localStorage.getItem("userData");
  const userDataObject = JSON.parse(userDataString);
  const userId = userDataObject.userId;

  const updateUser = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE_URL}users/${userId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      navigate("/")
    } catch (err) {}
  };
  return (
    <div className="main">
      <p className="title">Vaš Račun</p>
      <div className={classes.options + " options"}>
        <div className={classes.addingCars}>
          <form className={classes.wrapper} onSubmit={updateUser}>
            <Input
              element="input"
              id="name"
              type="text"
              label="Vaše ime"
              placeholder="Unesite Vaše ime"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Molimo unesite ime."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              placeholder="Unesite novi e-mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Molimo unesite validnu e-mail adresu."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Šifra"
              placeholder="Unesite novu šifru"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Molimo unesite šifru, minimalno 6 karaktera."
              onInput={inputHandler}
            />
            <Button type="submit">Ažuriraj</Button>
          </form>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default UserAccount;
