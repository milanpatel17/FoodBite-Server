/// THIS IS FINAL ORDERS ROUTE. ( RESTUARANT & TIFFIN ORDERS ARE COMBINED HERE.)
// Import Statements...
const { TiffinOrder } = require("../models/tiffinOrder");
const { TiffinOrderItem } = require("../models/tiffinOrderItem");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/// APIS Calling------------------------------
// GET_request (GET ALL ORDERS LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const orderList = await TiffinOrder.find()
    .populate("user")
    .populate({
      path: "tiffinOrderItems",
      populate: { path: "tiffinItem", populate: "tiffin_service" },
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
  const orders = await TiffinOrder.findById(req.params.id)
    .populate("user")
    .populate({
      path: "tiffinOrderItems",
      populate: { path: "tiffinItem", populate: "tiffin_service" },
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
  const ordersCount = await TiffinOrder.estimatedDocumentCount();
  if (!ordersCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    ordersCount: ordersCount,
  });
});

// POST_request (ADD NEW ORDER TO DATABASE)
router.post("/", async (req, res) => {
  //===================================================================================
  // Get Tiffin-order-items IDs...
  const tiffinOrderItemsIds = Promise.all(
    req.body.tiffinOrderItems.map(async (orderItem) => {
      let newTiffinOrderItem = new TiffinOrderItem({
        qty: orderItem.qty, // {quantity = qty}
        tiffinItem: orderItem.tiffinItem,
      });

      newTiffinOrderItem = await newTiffinOrderItem.save();

      return newTiffinOrderItem._id;
    })
  );
  const tiffinOrderItemsIdsResolved = await tiffinOrderItemsIds;
  //===================================================================================

  const totalPrices = await Promise.all(
    tiffinOrderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await TiffinOrderItem.findById(
        orderItemId
      ).populate("tiffinItem", "price");
      const total_price = orderItem.tiffinItem.price * orderItem.qty;
      return total_price;
    })
  );
  const total_price = totalPrices.reduce((a, b) => a + b, 0);

  
  let orders = new TiffinOrder({
    user: req.body.user,
    tiffinOrderItems: tiffinOrderItemsIdsResolved,
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
  const orders = await TiffinOrder.findByIdAndUpdate(
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
  TiffinOrder.findByIdAndRemove(req.params.id)
    .then(async (orders) => {
      if (orders) {
        await orders.tiffinOrderItems.map(async (orderItem) => {
          await TiffinOrderItem.findByIdAndRemove(orderItem);
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
