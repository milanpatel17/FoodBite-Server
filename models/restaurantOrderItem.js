// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const restaurantOrderItemSchema = mongoose.Schema({
  qty: { type: Number, required: true }, // {quantity = qty}
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodMenu",
  },
});

// ( "_id"  to  "id" using Virtuals)
restaurantOrderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

restaurantOrderItemSchema.set("toJSON", {
  virtuals: true,
});

// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.RestaurantOrderItem = mongoose.model(
  "RestaurantOrderItem",
  restaurantOrderItemSchema
);
exports.restaurantOrderItemSchema = restaurantOrderItemSchema;
// ((Collections in mongoDB = Tables in DBMS))
