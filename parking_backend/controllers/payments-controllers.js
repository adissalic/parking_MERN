const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const User = require("../models/user");
const Payment = require("../models/payments");

const getPayments = async (req, res, next) => {
  let payments;
  try {
    payments = await Payment.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching payment failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    payments,
  });
};

const getLastPaymentByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const payments = await Payment.find({ creator: userId }).sort({createdAt: -1}).limit(5);
    res.json({
      payments: payments.map((payment) => payment.toObject({ getters: true })),
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching payments failed, please try again later.",
      500
    );
    return next(error);
  }
};

const createPayment = async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new HttpError("Invalid inputs passed, please check your data.", 422)
        );
      }
  const { id, name, zone, price, plate } = req.body;
  const userId = req.params.uid;
  const currentDate = new Date();
  const createdPayment = new Payment({
    id,
    name,
    zone,
    plate,
    price,
    creator: userId,
    createdAt: currentDate,
  });

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Creating payment failed, please try again.",
      500
    );
    return next(error);
  }
try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPayment.save({ session: sess });
    user.payments.push(createdPayment);
    await user.save({ session: sess });
    await sess.commitTransaction();
}catch (err) {
    const error = new HttpError(
      "Creating payment failed, please try again.",
      500
    );
    return next(error);
  }
   res.status(201).json({ createdPayment });
/*
  await createdPayment
    .save()
    .then((savedPayment) => {
      console.log("Payment saved:", savedPayment);
    })
    .catch((error) => {
      console.error("Error saving payment:", error);
    });

  const creator = await User.findByIdAndUpdate(
    userId,
    { $push: { payments: createdPayment._id } },
    { new: true }
  );

  res.json(creator);
  */

};

const getSumOfPricesForUser = async (req, res, next) => {
  try {
    const result = await Payment.aggregate([
      { $group: { _id: null, sum: { $sum: "$price" } } },
    ]);

    if (result.length > 0) {
      res.json({ sum: result[0].sum });
    } else {
      res.json({ sum: 0 });
    }
  } catch (err) {
    console.error("Error calculating sum:", err);
    res.status(500).json({ message: "Calculating sum failed." });
  }
};

const getPaymentByUserId = async (req, res, next) => {
  const PAGE_SIZE = 10;
  const page = parseInt(req.query.page || "0");

  let payments;
  let totalPayments;
  try {
    totalPayments = await Payment.countDocuments({});
    payments = await Payment.find({})
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!payments) {
    const error = new HttpError(
      "Could not find place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    payments,
    totalPayments: Math.ceil(totalPayments / PAGE_SIZE),
  });
};

exports.getPayments = getPayments;
exports.getPaymentByUserId = getPaymentByUserId;
exports.getLastPaymentByUserId = getLastPaymentByUserId;
exports.createPayment = createPayment;
exports.getSumOfPricesForUser = getSumOfPricesForUser;
