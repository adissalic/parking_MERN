const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const Cars = require("../models/cars");
const User = require("../models/user");

const getCarsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithCars;
  try {
    userWithCars = await User.findById(userId).populate("cars");
  } catch (err) {
    const error = new HttpError(
      "Fetching cars failed, please try again later.",
      500
    );
    return next(error);
  }
 
  if (!userWithCars.cars || userWithCars.cars.length === 0) {
    return next(new HttpError("User has no cars.", 404));
  }

  res.json({
    cars: userWithCars.cars.map((car) => car.toObject({ getters: true })),
  });
};

const createCar = async (req, res, next) => {
  const { name, plate } = req.body;
  const userId = req.params.uid;

  const createdCar = new Cars({
    name: name,
    plate: plate,
    creator: userId,
  });

  await createdCar.save();
  const creator = await User.findByIdAndUpdate(
    userId,
    { $push: { cars: createdCar._id } },
    { new: true }
  );

  res.json(creator);
};


const deleteCar = async (req, res, next) => {
  const carId = req.params.cid;

  let car;
  try {
    car = await Cars.findById(carId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!car) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  if (car.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await car.deleteOne({ session: session });
    car.creator.cars.pull(car);
    await car.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place. ",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getCarsByUserId = getCarsByUserId;
exports.createCar = createCar;
exports.deleteCar = deleteCar;
