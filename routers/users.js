// Import Statements...
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

/// APIS Calling------------------------------
// GET_request (GET ALL USERS LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-__v -password");
  res.send(userList);
});

// GET_request // FOR ADMINS :-(GET PARTICULAR USER FROM DATABASE)
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID !!!");
  }
  const user = await User.findById(req.params.id).select("-__v -password");
  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found !!!" });
    return;
  }
  res.status(200).send(user);
});

// GET_request // FOR USERS :-(GET PARTICULAR USER FROM DATABASE)
router.get("/userProfile/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID !!!");
  }
  const user = await User.findById(req.params.id).select("-__v -password");
  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found !!!" });
    return;
  }
  res.status(200).send(user);
});

// GET_request (GET TOTAL(count) USERS FROM DATABASE)
router.get(`/get/count`, async (req, res) => {
  const userCount = await User.estimatedDocumentCount();
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

// POST_request
// POST_request // FOR ADMINS :-(REGISTRATION / ADD NEW USER TO DATABASE )
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    image: req.body.image,
    email_id: req.body.email_id,
    password: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address,
    mobile_no: req.body.mobile_no,
    isAdmin: req.body.isAdmin,
    restaurant_orders: req.body.restaurant_orders,
    tiffin_orders: req.body.tiffin_orders,
    table_bookings: req.body.table_bookings,
  });
  user = await user.save();

  if (!user) {
    return res.status(400).send("The user can't be created !!!");
  }

  res.send(user);
});

// POST_request // FOR USERS :-(REGISTRATION / ADD NEW USER TO DATABASE )
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    image: req.body.image,
    email_id: req.body.email_id,
    password: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address,
    mobile_no: req.body.mobile_no,
    isAdmin: req.body.isAdmin,
    restaurant_orders: req.body.restaurant_orders,
    tiffin_orders: req.body.tiffin_orders,
    table_bookings: req.body.table_bookings,
  });
  user = await user.save();

  if (!user) {
    return res.status(400).send("The user can't be created !!!");
  }

  res.send(user);
});

// POST_request (LOGIN / LOGIN TO APPLICATION)
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email_id: req.body.email_id }); // find user in database with its email_id

  const secret = process.env.secret;

  if (!user) {
    return res.status(400).send("The user not found !!!");
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userID: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "365d" }
    );

    return res.status(200).send({ user: user.email_id, token: token });
  } else {
    return res.status(400).send("Password is Wrong !!!");
  }

  // return res.status(200).send(user);
});

// PUT_request // FOR ADMINS :-(UPDATE PARTICULAR USER-DATA IN DATABASE)
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid User ID !!!");
  }

  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10); // if new password provided for update (update old password with new one)
  } else {
    newPassword = userExist.password; // no change in old password
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      email_id: req.body.email_id,
      password: newPassword,
      address: req.body.address,
      mobile_no: req.body.mobile_no,
      isAdmin: req.body.isAdmin,
      restaurant_orders: req.body.restaurant_orders,
      tiffin_orders: req.body.tiffin_orders,
      table_bookings: req.body.table_bookings,
    },
    { new: true }
  );
  if (!user) {
    return res.status(400).send("The user can't be updated !!!");
  }

  res.send(user);
});

// PUT_request // FOR USERS :-(UPDATE PARTICULAR USER'S PROFILE IN DATABASE)
router.put("/userProfile/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid User ID !!!");
  }

  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10); // if new password provided for update (update old password with new one)
  } else {
    newPassword = userExist.password; // no change in old password
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      email_id: req.body.email_id,
      password: newPassword,
      address: req.body.address,
      mobile_no: req.body.mobile_no,
      // isAdmin: req.body.isAdmin,
      restaurant_orders: req.body.restaurant_orders,
      tiffin_orders: req.body.tiffin_orders,
      table_bookings: req.body.table_bookings,
    },
    { new: true }
  );
  if (!user) {
    return res.status(400).send("The user can't be updated !!!");
  }

  res.send(user);
});

// DELETE_request (REMOVE PARTICULAR USER FROM DATABASE)
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted !!!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The user not found !!!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});
///-------------------------------------------

module.exports = router;
