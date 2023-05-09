// Import Statements...
const { TableBooking } = require("../models/tableBooking");
const express = require("express");
const { Restaurant } = require("../models/restaurant");
const router = express.Router();
const mongoose = require("mongoose");

/// APIS Calling------------------------------
// GET_request (GET ALL TABLE-BOOKINGS LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const tableBookingList = await TableBooking.find()
    .populate("restaurant")
  .sort({ date: -1 })
    .select("-__v");
  res.send(tableBookingList);
});

// GET_request (GET PARTICULAR TABLE-BOOKING FROM DATABASE)
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid foodMenu ID !!!");
  }
  const tableBooking = await tableBooking
    .findById(req.params.id)
    .populate("restaurant")
    .select("-__v");
  if (!tableBooking) {
    res.status(500).json({
      success: false,
      message: "The table-booking with the given ID was not found !!!",
    });
    return;
  }
  res.status(200).send(tableBooking);
});

// GET_request (GET TOTAL(count) TABLE-BOOKINGS FROM DATABASE)
router.get(`/get/count`, async (req, res) => {
  const tableBookingCount = await TableBooking.estimatedDocumentCount();
  if (!tableBookingCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    tableBookingCount: tableBookingCount,
  });
});

// POST_request (ADD NEW TABLE-BOOKING TO DATABASE)
router.post("/", async (req, res) => {
  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant) {
    return res.status(400).send("Invalid Restaurant !!!");
  }

  let tableBooking = new TableBooking({
    no_of_seats: req.body.no_of_seats,
    dateOfBooking: req.body.dateOfBooking,
    time: req.body.time,
    restaurant: req.body.restaurant,
    dateOnBooked: req.body.dateOnBooked,
  });
  tableBooking = await tableBooking.save();

  if (!tableBooking) {
    return res.status(500).send("The table can't be booked !!!");
  }

  res.send(tableBooking);
});

// PUT_request (UPDATE PARTICULAR TABLE-BOOKINGIN DATABASE)
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid foodMenu ID !!!");
  }
  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant) {
    return res.status(400).send("Invalid Restaurant !!!");
  }

  const foodMenu = await FoodMenu.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
      restaurant_id: req.body.restaurant_id,
      no_of_seats: req.body.no_of_seats,
      date: req.body.date,
      time: req.body.time,
      date: req.body.date,
    },
    { new: true }
  );
  if (!tableBooking) {
    return res.status(400).send("The table-booking can't be updated !!!");
  }

  res.send(tableBooking);
});

// DELETE_request (REMOVE PARTICULAR TABLE-BOOKING FROM DATABASE)
router.delete("/:id", (req, res) => {
  TableBooking.findByIdAndRemove(req.params.id)
    .then((tableBooking) => {
      if (tableBooking) {
        return res
          .status(200)
          .json({ success: true, message: "The table-booking is deleted !!!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The table-booking not found !!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
///-------------------------------------------

module.exports = router;
