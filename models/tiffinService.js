// Import Statements...
const mongoose = require("mongoose");

// Database Schema ((Note:- Schema is like a BluePrint of Model...))
const tiffinServiceSchema = mongoose.Schema({
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
tiffinServiceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

tiffinServiceSchema.set("toJSON", {
  virtuals: true,
});
// Database Model ((Remember:Model name starts with Capital Letter))
// ((Model in nodeJS = Collection in mongoDB...))
exports.TiffinService = mongoose.model("TiffinService", tiffinServiceSchema);
exports.tiffinServiceSchema = tiffinServiceSchema;
// ((Collections in mongoDB = Tables in DBMS))
//===============================================================================================================

//---------------------------------------------------------------------------------------------------------------

//===============================================================================================================

/// {----REGISTER TIFFIN_SERVICE----}
// {
//   "name": "Tiffin Service 0",
//   "image": "--------",
//   "ratings": "--------",
//   "description": "--------",
//   "area": "--------",
//   "address": "--------",
//   "email_id": "--------",
//   "mobile_no": "--------",
//   "timings": "--------"
// }
///--------------------------------------------------

/// {----UPDATE TIFFIN_SERVICE DATABASE----}
// {
//   "name": "Tiffin Service 0",
//   "image": "--------",
//   "ratings": "--------",
//   "description": "--------",
//   "area": "--------",
//   "address": "--------",
//   "email_id": "--------",
//   "mobile_no": "--------",
//   "timings": "--------"
// }
///--------------------------------------------------