import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "./LoadingSpinner";

const PaymentsSum = () => {
  const [loadedSum, setLoadedSum] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const fetchSum = async () => {
      try {
        const responseData = await sendRequest(
          `https://parking-backend-06pc.onrender.com/api/payments/${auth.userId}/sum`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        setLoadedSum(responseData.sum);
        setIsLoaded(true)
      } catch (err) {}
    };
    fetchSum();
  }, [sendRequest, loadedSum, auth.userId, auth.token]);

  return (
    <h4 className="text">
      Plaćeno:{!isLoaded && <LoadingSpinner />} {loadedSum}KM
    </h4>
  );
};

export default PaymentsSum;
