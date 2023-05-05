/// THIS IS FINAL ORDERS ROUTE. ( RESTUARANT & TIFFIN ORDERS ARE COMBINED HERE.)
// Import Statements...
const { RestaurantOrder } = require("../models/restaurantOrder");
const { RestaurantOrderItem } = require("../models/restaurantOrderItem");
// const { TiffinOrderItem } = require("../models/tiffinOrderItem");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/// APIS Calling------------------------------
// GET_request (GET ALL ORDERS LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const orderList = await RestaurantOrder.find()
    .populate("user")
    .populate({
      path: "restaurantOrderItems",
      populate: { path: "foodItem", populate: "restaurant" },
    })
    .sort({ date: -1 })
    .select("-__v");
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(orderList);
});

// GET_request (GET PARTICULAR ORDER FROM DATABASE)
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid orders ID !!!");
  }
  const orders = await RestaurantOrder.findById(req.params.id)
    .populate("user")
    .populate({
      path: "restaurantOrderItems",
      populate: { path: "foodItem", populate: "restaurant" },
    })
    .select("-__v");
  if (!orders) {
    res
      .status(500)
      .json({ message: "The orders with the given ID was not found !!!" });
    return;
  }
  res.status(200).send(orders);
});

// GET_request (GET TOTAL(count) ORDERS FROM DATABASE)
router.get(`/get/count`, async (req, res) => {
  const ordersCount = await RestaurantOrder.estimatedDocumentCount();
  if (!ordersCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    ordersCount: ordersCount,
  });
});

// GET_request (GET ALL ORDERS LIST FROM DATABASE FOR PARTICULAR USER)
router.get(`/get/userOrders/:userId`, async (req, res) => {
  const userOrderList = await RestaurantOrder.find({user: req.params.userId})
    .populate({
      path: "restaurantOrderItems",
      populate: { path: "foodItem", populate: "restaurant" },
    })
    .sort({ date: -1 })
    .select("-__v");
  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userOrderList);
});


// POST_request (ADD NEW ORDER TO DATABASE)
router.post("/", async (req, res) => {
  //===================================================================================
  // Get Restaurant-order-items IDs...
  const restaurantOrderItemsIds = Promise.all(
    req.body.restaurantOrderItems.map(async (orderItem) => {
      let newRestaurantOrderItem = new RestaurantOrderItem({
        qty: orderItem.qty, // {quantity = qty}
        foodItem: orderItem.foodItem,
      });

      newRestaurantOrderItem = await newRestaurantOrderItem.save();

      return newRestaurantOrderItem._id;
    })
  );
  const restaurantOrderItemsIdsResolved = await restaurantOrderItemsIds;
  //===================================================================================

  const totalPrices = await Promise.all(
    restaurantOrderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await RestaurantOrderItem.findById(
        orderItemId
      ).populate("foodItem", "price");
      const total_price = orderItem.foodItem.price * orderItem.qty;
      return total_price;
    })
  );
  const total_price = totalPrices.reduce((a, b) => a + b, 0);

  let orders = new RestaurantOrder({
    user: req.body.user,
    restaurantOrderItems: restaurantOrderItemsIdsResolved,
    address: req.body.address,
    mobile_no: req.body.mobile_no,
    total_price: total_price,
    status: req.body.status,
  });
  orders = await orders.save();

  if (!orders) {
    return res.status(400).send("The orders can't be created !!!");
  }

  res.send(orders);
});

// PUT_request (UPDATE PARTICULAR ORDER-DATA IN DATABASE)
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid order ID !!!");
  }
  const orders = await RestaurantOrder.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!orders) {
    return res.status(400).send("The orders can't be updated !!!");
  }

  res.send(orders);
});

// DELETE_request (REMOVE PARTICULAR ORDER FROM DATABASE)
router.delete("/:id", (req, res) => {
  RestaurantOrder.findByIdAndRemove(req.params.id)
    .then(async (orders) => {
      if (orders) {
        await orders.restaurantOrderItems.map(async (orderItem) => {
          await RestaurantOrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "The orders is deleted !!!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The orders not found !!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
///-------------------------------------------

// Export Statements...
module.exports = router;

// {
//   "user": "{add-user-id}",
//   "restaurantOrderItems": "{"qty":"------", "foodItem":"------" }",
//   "address": "------",
//   "mobile_no": "------",
//   "total_price": "------",
//   "status": "------"
// }
