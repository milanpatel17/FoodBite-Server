// Import Statements...
const { Restaurant } = require("../models/restaurant");
const { FoodMenu } = require("../models/foodMenu");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// Image Upload Section --------------------------------------
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `Resturant-${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
//------------------------------------------------------------

/// APIS Calling------------------------------
// GET_request (GET ALL RESTAURANTS LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const restaurantList = await Restaurant.find().select("-__v");
  if (!restaurantList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(restaurantList);
});

// GET_request (GET PARTICULAR RESTAURANT FROM DATABASE)
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid restaurant ID !!!");
  }
  const restaurant = await Restaurant.findById(req.params.id).select("-__v");
  if (!restaurant) {
    res
      .status(500)
      .json({ message: "The restaurant with the given ID was not found !!!" });
    return;
  }
  res.status(200).send(restaurant);
});

// GET_request (GET TOTAL(count) RESTAURANTS FROM DATABASE)
router.get(`/get/count`, async (req, res) => {
  const restaurantCount = await Restaurant.estimatedDocumentCount();
  if (!restaurantCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    restaurantCount: restaurantCount,
  });
});

// POST_request (ADD NEW RESTAURANT TO DATABASE)
router.post("/",  uploadOptions.single("image"),async (req, res) => {

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let restaurant = new Restaurant({
    name: req.body.name,
    image: `${basePath}${fileName}`,
    ratings: req.body.ratings,
    description: req.body.description,
    area: req.body.area,
    address: req.body.address,
    email_id: req.body.email_id,
    mobile_no: req.body.mobile_no,
    timings: req.body.timings,
    date: req.body.date,
  });
  restaurant = await restaurant.save();

  if (!restaurant) {
    return res.status(400).send("The restaurant can't be created !!!");
  }

  res.send(restaurant);
});

// PUT_request (UPDATE PARTICULAR RESTAURANT-DATA IN DATABASE)
router.put("/:id",uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid foodMenu ID !!!");
  }
  
  const restaurantExist = await Restaurant.findById(req.params.id);
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${fileName}`; // if new image provided for update (update old image with new one)
    
  } else {
    imagePath = restaurantExist.image; // no change in old image
  }

  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: imagePath,
      ratings: req.body.ratings,
      description: req.body.description,
      area: req.body.area,
      address: req.body.address,
      email_id: req.body.email_id,
      mobile_no: req.body.mobile_no,
      timings: req.body.timings,
      date: req.body.date,
    },
    { new: true }
  );
  if (!restaurant) {
    return res.status(400).send("The restaurant can't be updated !!!");
  }

  res.send(restaurant);
});

// PUT_request for foodmenu (UPDATE PARTICULAR RESTAURANT-DATA IN DATABASE)
router.put("/foodMenus/:id",uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid foodMenu ID !!!");
  }
  
  const restaurantExist = await Restaurant.findById(req.params.id);
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${fileName}`; // if new image provided for update (update old image with new one)
    
  } else {
    imagePath = restaurantExist.image; // no change in old image
  }

  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
Menu : req.b
    },
    { new: true }
  );
  if (!restaurant) {
    return res.status(400).send("The restaurant can't be updated !!!");
  }

  res.send(restaurant);
});

// DELETE_request (REMOVE PARTICULAR RESTAURANT FROM DATABASE)
router.delete("/:id", async (req, res) => {
  const restId = await Restaurant.findById(req.params.id); // find user in database with its email_id

  Restaurant.findByIdAndRemove(req.params.id)
    .then(async (restaurant) => {
      if (restaurant) {
        return res
          .status(200)
          .json({ success: true, message: "The restaurant is deleted !!!" });
          
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The restaurant not found !!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
    
});

///-------------------------------------------

// Export Statements...
module.exports = router;
