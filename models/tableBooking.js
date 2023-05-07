// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const tableBookingSchema = mongoose.Schema({
  no_of_seats: { type: String, required: true },
  dateOfBooking: { 
    type: String, required: true },
  time: { 
    type: String, required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  dateOnBooked: { type: Date, default: Date.now },
}
 );

// ( "_id"  to  "id" using Virtuals) 
tableBookingSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

tableBookingSchema.set('toJSON',{
  virtuals : true,
});


// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.TableBooking = mongoose.model("TableBooking", tableBookingSchema);
exports.tableBookingSchema = tableBookingSchema;
// ((Collections in mongoDB = Tables in DBMS))
//===============================================================================================================

//---------------------------------------------------------------------------------------------------------------

//===============================================================================================================

/// {----REGISTER TIFFIN_SERVICE----}
//  {
//    "no_of_seats": "10",
//    "date": "--------",
//    "time": "--------",
//    "restaurant": "{paste-restaurant-id}"
//  }
///--------------------------------------------------

/// {----UPDATE TIFFIN_SERVICE DATABASE----}
//  {
//    "no_of_seats": "12",
//    "date": "--------",
//    "time": "--------",
//    "restaurant": "{paste-restaurant-id}"
//  }
///--------------------------------------------------
