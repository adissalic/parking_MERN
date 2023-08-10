const express = require("express");
const { check } = require("express-validator");
const paymentControllers = require("../controllers/payments-controllers");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();
router.get("/", paymentControllers.getPayments);

// router.use(checkAuth);
router.get("/:uid/last", paymentControllers.getLastPaymentByUserId);
router.get("/:uid/payments", paymentControllers.getPaymentByUserId);
router.get("/:uid/sum", paymentControllers.getSumOfPricesForUser);

router.post(
  "/:uid",
  [
    check("id").not().isEmpty(),
    check("name").not().isEmpty(),
    check("plate").not().isEmpty(),
    check("zone").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  paymentControllers.createPayment
);


module.exports = router;
