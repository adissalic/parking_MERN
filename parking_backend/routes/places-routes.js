const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.get("/", placesControllers.getPlaces);

router.use(checkAuth);
router.get("/all", placesControllers.getPlace);
router.post(
  "/",
  [
    check("id").not().isEmpty(),
    check("zone").isLength({ min: 5 }),
    check("position").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("id").not().isEmpty(), check("zone").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
