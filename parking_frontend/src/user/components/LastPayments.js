import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import classes from "./LastPayments.module.css";
import CarSelection from "./CarSelection";

const LastPayments = () => {
  const [isSelectCarOpen, setIsSelectCarOpen] = useState(false);
  const [selectedPay, setSelectedPay] = useState([]);
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedPayments, setLoadedPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const responseData = await sendRequest(
          `https://parking-backend-06pc.onrender.com/api/payments/${auth.userId}/last`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedPayments(responseData.payments);
      } catch (err) {}
    };
    fetchPayments();
  }, [sendRequest, auth.token, auth.userId, isSelectCarOpen]);

  const carSelect = (payment) => {
    setSelectedPay(payment);
    setIsSelectCarOpen(true);
  };

  const closeSelectCar = () => {
    setIsSelectCarOpen(false);
  };

  return (
    <React.Fragment>
      {loadedPayments.length > 0 ? (
        <h5 className={classes.text}>Klikni da platiš ponovo</h5>
      ) : (
        "Nemate plaćanja"
      )}
      {loadedPayments.map((payment) => (
        <Link key={payment._id} onClick={() => carSelect(payment)}>
          {payment.name}
        </Link>
      ))}
      {isSelectCarOpen && (
        <CarSelection selectedPay={selectedPay} onClose={closeSelectCar} />
      )}
    </React.Fragment>
  );
};

export default LastPayments;
