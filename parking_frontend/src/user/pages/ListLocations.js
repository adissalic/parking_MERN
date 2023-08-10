import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import classes from "./ListLocations.module.css";
import { AuthContext } from "../../context/auth-context";
import CarSelection from "../components/CarSelection";

const ListLocations = () => {
  const auth = useContext(AuthContext);
  const [pageNumber, setPageNumber] = useState(0);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [totalPages, setTotalPages] = useState();
  const { sendRequest } = useHttpClient();
  const pages = new Array(totalPages).fill(null).map((v, i) => i);

  const [isSelectCarOpen, setIsSelectCarOpen] = useState(false);
  const [selectedPay, setSelectedPay] = useState([]);
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5500/api/places/all/?page=${pageNumber}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedPlaces(responseData.place);
        setTotalPages(responseData.totalPages);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, pageNumber, auth.token]);
  const goPrevious = () => {
    setPageNumber(Math.max(0, pageNumber - 1));
  };
  const goNext = () => {
    setPageNumber(Math.min(totalPages - 1, pageNumber + 1));
  };

  const carSelect = (placesNew) => {
    setSelectedPay(placesNew);
    setIsSelectCarOpen(true);
  };
  const closeSelectCar = () => {
    setIsSelectCarOpen(false);
  };
  return (
    <div className="main">
      <p className="title">Vaš Parking</p>
      <h3 className="heading">Spisak lokacija</h3>
      <div className={classes.options + " options"}>
        {loadedPlaces?.map((placesNew) => (
          <div
            className={classes.items}
            key={placesNew._id}
            onClick={() => carSelect(placesNew)}
          >
            {placesNew.name}
          </div>
        ))}
      </div>
      {isSelectCarOpen && (
        <CarSelection selectedPay={selectedPay} onClose={closeSelectCar} />
      )}
      <div className={classes.pagination}>
        <button onClick={goPrevious}> &lt; </button>
        {pages.map((pageIndex) => (
          <button
            className={pageIndex !== pageNumber ? "" : classes.active}
            key={pageIndex}
            onClick={() => setPageNumber(pageIndex)}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button onClick={goNext}> &gt; </button>
      </div>
    </div>
  );
};

export default ListLocations;
