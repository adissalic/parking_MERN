const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.patch(
  "/:uid",
  [
    check("name").not().isEmpty().optional(),
    check("email").isEmail().optional(),
    check("password").isLength({ min: 6 }).optional(),
  ],
  usersController.updateUser
);
router.post("/login", usersController.login);


router.get("/:uid", usersController.getUserById);

module.exports = router;
