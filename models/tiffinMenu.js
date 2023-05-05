// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const tiffinMenuSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: {
    type: String,
    // required: true
  },
  price: { type: String, required: true },
  description: { type: String, required: true },
  tiffin_service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TiffinService",
    required: true,
  },
  date: { type: Date, default: Date.now },
});

// ( "_id"  to  "id" using Virtuals) 
tiffinMenuSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

tiffinMenuSchema.set('toJSON',{
  virtuals : true,
});


// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.TiffinMenu = mongoose.model("TiffinMenu", tiffinMenuSchema);
exports.tiffinMenuSchema = tiffinMenuSchema;
// ((Collections in mongoDB = Tables in DBMS))
//===============================================================================================================

//---------------------------------------------------------------------------------------------------------------

//===============================================================================================================

/// {----REGISTER TIFFIN_SERVICE----}
// {
//   "name": "tiffin item 0",
//   "image": "--------",
//   "price": "0",
//   "description": "--------",
//   "tiffin_service": "{paste-tiffinService-id}"
// }
///--------------------------------------------------

/// {----UPDATE TIFFIN_SERVICE DATABASE----}
// {
//   "name": "tiffin item 0",
//   "image": "--------",
//   "price": "0",
//   "description": "--------",
//   "tiffin_service": "{paste-tiffinService-id}"
// }
///--------------------------------------------------
