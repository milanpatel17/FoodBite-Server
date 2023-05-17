/// THIS IS FINAL ORDERS SCHEMA. ( RESTUARANT & TIFFIN ORDERS ARE COMBINED HERE.)
// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const TiffinOrderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tiffinOrderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TiffinOrderItem",
      required: true,
    },
  ],

  address: { type: String, required: true },
  mobile_no: { type: String, required: true },
  total_price: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true, default: "Order Accepted !!!" },
});

// ( "_id"  to  "id" using Virtuals)
TiffinOrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

TiffinOrderSchema.set("toJSON", {
  virtuals: true,
});

// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.TiffinOrder = mongoose.model("TiffinOrder", TiffinOrderSchema);
exports.TiffinOrderSchema = TiffinOrderSchema;
// ((Collections in mongoDB = Tables in DBMS))
