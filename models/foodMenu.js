// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const foodMenuSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: {
    type: String,
    // required: true
  },
  price: { type: String, required: true },
  description: { type: String, required: true, default: 0 },
//   restaurant: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Restaurant",
//     // required: true,
//   },
  date: { type: Date, default: Date.now },
});

// ( "_id"  to  "id" using Virtuals)
foodMenuSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

foodMenuSchema.set("toJSON", {
  virtuals: true,
});

// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.FoodMenu = mongoose.model("FoodMenu", foodMenuSchema);
exports.foodMenuSchema = foodMenuSchema;
// ((Collections in mongoDB = Tables in DBMS))
//===============================================================================================================

//---------------------------------------------------------------------------------------------------------------

//===============================================================================================================

/// {----REGISTER TIFFIN_SERVICE----}
//  {
//    "name":  "food item 0",
//    "image": "--------",
//    "price":  "0",
//    "description": "--------",
//    "restaurant":  "{paste-restaurant-id}"
//  }
///--------------------------------------------------

/// {----UPDATE TIFFIN_SERVICE DATABASE----}
//  {
//    "name":  "food item 0",
//    "image": "--------",
//    "price":  "0",
//    "description": "--------",
//    "restaurant":  "{paste-restaurant-id}"
//  }
///--------------------------------------------------
