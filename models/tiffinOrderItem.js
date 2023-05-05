// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const tiffinOrderItemSchema = mongoose.Schema({
  qty: { type: Number, required: true }, // {quantity = qty}
  tiffinItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TiffinMenu",
  },
});

// ( "_id"  to  "id" using Virtuals)
tiffinOrderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

tiffinOrderItemSchema.set("toJSON", {
  virtuals: true,
});

// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.TiffinOrderItem = mongoose.model(
  "TiffinOrderItem",
  tiffinOrderItemSchema
);
exports.tiffinOrderItemSchema = tiffinOrderItemSchema;
// ((Collections in mongoDB = Tables in DBMS))
