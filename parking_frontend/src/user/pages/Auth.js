import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/FormElements/Input";
import Button from "../components/FormElements/Button";

import LoadingSpinner from "../components/LoadingSpinner";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";

import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";

import classes from "./Auth.module.css";
import ErrorPopUp from "../../components/ErrorPopUp";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, sendRequest } = useHttpClient();
  const [isError, setError] = useState("");
  const [showError, isShowingError] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if (window.location.pathname === "/register") {
      setIsLoginMode(false);
    }
    if (window.location.pathname === "/login") {
      setIsLoginMode(true);
    }
  }, [isLoginMode]);
  const switchModeHandler = (e) => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
      navigate("/login");
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
      navigate("/register");
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const navigate = useNavigate();

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `http://localhost:5500/api/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
        navigate("/");
      } catch (err) {
        setError(err.message);
        isShowingError(true);
      }
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5500/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);

        navigate("/");
      } catch (err) {
        setError(err.message);
        isShowingError(true);
      }
    }
  };
  const closeError = () => {
    isShowingError(false);
  };
  return (
    <div className="main">
      <div className={classes.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className={classes.title}>
          {isLoginMode ? "Prijava" : "Registracija"}
        </h2>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
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
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            placeholder="Unesite Vaš e-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Molimo unesite validnu e-mail adresu."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Šifra"
            placeholder="Unesite Vašu šifru"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Molimo unesite šifru, minimalno 6 karaktera."
            onInput={inputHandler}
          />
          <Button type="submit" size="small" disabled={!formState.isValid}>
            {isLoginMode ? "PRIJAVA" : "REGISTRACIJA"}
          </Button>
        </form>
        <button onClick={switchModeHandler}>
          {isLoginMode
            ? "Nemaš račun?  Registruj se"
            : "Imaš račun? Prijavi se"}
        </button>
        {showError && (
          <div onClick={closeError}>
            <ErrorPopUp>{isError}</ErrorPopUp>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
