// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: {
    type: String,
    // required: true
  },
  ratings: { type: String, required: true },
  description: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true },
  email_id: { type: String, required: true },
  mobile_no: { type: String, required: true },
  timings: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// ( "_id"  to  "id" using Virtuals) 
restaurantSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

restaurantSchema.set('toJSON',{
  virtuals : true,
});

// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.Restaurant = mongoose.model("Restaurant", restaurantSchema);
exports.restaurantSchema = restaurantSchema;
// ((Collections in mongoDB = Tables in DBMS))
//===============================================================================================================

//---------------------------------------------------------------------------------------------------------------

//===============================================================================================================

/// {----REGISTER RESTAURANT----}
//  {
//    "name":  "restaurant 0",
//    "image": "--------",
//    "ratings":  "--------",
//    "description": "--------",
//    "area":  "--------",
//    "address":"--------",
//    "email_id": "--------",
//    "mobile_no": "--------",
//    "timings": "--------",
  //  "restaurantMenuItems": [{
  //  "name":  "food item 0",
  //  "image": "--------",
  //  "price":  "0",
  //  "description": "--------",
  //  "restaurant":  "{paste-restaurant-id}"
  //   }]
//  }
///--------------------------------------------------

/// {----UPDATE RESTAURANT DATABASE----}
//  {
//    "name":  "restaurant 0",
//    "image": "--------",
//    "ratings":  "--------",
//    "description": "--------",
//    "area":  "--------",
//    "address":"--------",
//    "email_id": "--------",
//    "mobile_no": "--------",
//    "timings": "--------"
//  }
///--------------------------------------------------
