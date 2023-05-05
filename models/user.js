// Import Statements...
const mongoose = require("mongoose");
const validator = require("validator");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: {
    type: String,
    //  required: true
  },
  email_id: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: { type: String, required: true },
  address: { type: String, required: true },
  mobile_no: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  restaurant_orders: { type: String, required: true },
  tiffin_orders: { type: String, required: true },
  table_bookings: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// ( "_id"  to  "id" using Virtuals)
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
// ((Collections in mongoDB = Tables in DBMS))
//===============================================================================================================

//---------------------------------------------------------------------------------------------------------------

//===============================================================================================================

/// {----REGISTER USER----}
//  {
//    "name":  " ",
//    "image": "--------",
//    "email_id": " ",
//    "password": "--------",
//    "address":  "--------",
//    "mobile_no": "--------",
//    "isAdmin": false,
//    "restaurant_orders":  "--------",
//    "tiffin_orders": "--------",
//    "table_bookings":"--------"
//  }
///--------------------------------------------------

/// {----LOGIN USER----}
//  {
//    "email_id": " ",
//    "password": " "
//  }
///--------------------------------------------------

/// {----UPDATE USER PROFILE----} // USE TOKENS
//  {
//    "name":  " ",
//    "image": "--------",
//    "email_id": " ",
//    "password": "--------",
//    "address":  "--------",
//    "mobile_no": "--------",
//    "isAdmin": false,
//    "restaurant_orders":  "--------",
//    "tiffin_orders": "--------",
//    "table_bookings":"--------"
//  }
///--------------------------------------------------
