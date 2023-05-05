/// THIS IS FINAL ORDERS SCHEMA. ( RESTUARANT & TIFFIN ORDERS ARE COMBINED HERE.)
// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const RestaurantOrderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurantOrderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantOrderItem",
      required: true,
    },
  ],
  address: { type: String, required: true },
  mobile_no: { type: String, required: true },
  total_price: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true, default: "TiffinOrder Accepted !!!" },
});

// ( "_id"  to  "id" using Virtuals)
RestaurantOrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

RestaurantOrderSchema.set("toJSON", {
  virtuals: true,
});

// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.RestaurantOrder = mongoose.model("RestaurantOrder", RestaurantOrderSchema);
exports.RestaurantOrderSchema = RestaurantOrderSchema;
// ((Collections in mongoDB = Tables in DBMS))
