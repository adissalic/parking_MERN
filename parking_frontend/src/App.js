import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Auth from "./user/pages/Auth";

import { useAuth } from "./hooks/auth-hook";

import MainPage from "./pages/MainPage";
import FastPay from "./pages/FastPay";
import Tuzla from "./pages/Tuzla";
import Footer from "./components/Footer";
import BackDrop from "./components/BackDrop";
import MapPage from "./pages/MapPage";
import Zivinice from "./pages/Zivinice";
import { AuthContext } from "./context/auth-context";
import UserMainPage from "./user/pages/UserMainPage";
import MainMenu from "./user/components/MainMenu";
import ErrorPage from "./pages/ErrorPage";
import ListLocations from "./user/pages/ListLocations";
import UserCars from "./user/pages/UserCars";
import UserAccount from "./user/pages/UserAccount";
import PaymentsList from "./user/pages/PaymentsList";

const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;
  if (token) {
    routes = (
      <>
        <Route path="*" exact element={<ErrorPage />} />
        <Route path="/" exact element={<UserMainPage />} />
        <Route path="/account" exact element={<UserAccount />} />
        <Route path="/map" exact element={<MapPage />} />
        <Route path="/carslist" exact element={<UserCars />} />
        <Route path="/fastpay" exact element={<FastPay />} />
        <Route path="/locations-list" exact element={<ListLocations />} />
        <Route path="/payments" exact element={<PaymentsList />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route path="*" exact element={<ErrorPage />} />
        <Route path="/" exact element={<MainPage />} />
        <Route path="/fastpay" exact element={<FastPay />} />
        <Route path="/map" exact element={<MapPage />} />
        <Route path="/tuzla" exact element={<Tuzla />} />
        <Route path="/zivinice" exact element={<Zivinice />} />
        <Route path="/login" exact element={<Auth />} />
        <Route path="/register" exact element={<Auth />} />
      </>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <main className="App">
          <BackDrop />
          {token && <MainMenu />}
          <Routes>{routes}</Routes>
          <Footer />
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
