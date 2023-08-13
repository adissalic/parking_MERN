import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import classes from "./PaymentsList.module.css";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../components/LoadingSpinner";

const PaymentsList = () => {
  const auth = useContext(AuthContext);
  const [pageNumber, setPageNumber] = useState(0);
  const [loadedPayments, setLoadedPayments] = useState();
  const [totalPages, setTotalPages] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const { sendRequest } = useHttpClient();
  const pages = new Array(totalPages).fill(null).map((v, i) => i);
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const responseData = await sendRequest(
          `https://parking-backend-06pc.onrender.com/api/payments/${auth.userId}/payments?page=${pageNumber}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedPayments(responseData.payments);
        setTotalPages(responseData.totalPayments);
        setIsLoaded(true)
      } catch (err) {}
    };
    fetchPayments();
  }, [sendRequest, pageNumber, auth.token, auth.userId, totalPages]);
  const goPrevious = () => {
    setPageNumber(Math.max(0, pageNumber - 1));
  };
  const goNext = () => {
    setPageNumber(Math.min(totalPages - 1, pageNumber + 1));
  };
  return (
    <div className="main">
      <p className="title">Vaš Parking</p>
      <h3 className="heading">Pregled plaćanja</h3>
      <div className={classes.options + " options"}>
        {!isLoaded && <LoadingSpinner />
        }
        {loadedPayments?.map((paymentsNew) => (
          <div className={classes.items} key={paymentsNew._id}>
            <span> {paymentsNew.name} </span>
            <span>{paymentsNew.price} KM</span>
          </div>
        ))}
      </div>
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

export default PaymentsList;
