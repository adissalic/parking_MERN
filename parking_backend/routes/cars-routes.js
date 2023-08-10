const express = require("express");
const { check } = require("express-validator");

const carsControllers = require("../controllers/cars-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();


router.get("/user/:uid", carsControllers.getCarsByUserId);

  router.use(checkAuth);

router.post(
  "/:uid",
  [
    check("name").not().isEmpty(),
    check("plate").not().isEmpty(),
  ],
  carsControllers.createCar
);

router.delete("/:cid", carsControllers.deleteCar);

module.exports = router;
