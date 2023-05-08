// Import Statements...
const { FoodMenu } = require("../models/foodMenu");
const express = require("express");
const { Restaurant } = require("../models/restaurant");
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
    cb(null, `FoodItem-${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
//------------------------------------------------------------

/// APIS Calling------------------------------
// GET_request (GET ALL FOOD-ITEMS LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const foodMenuList = await FoodMenu.find()
    .populate("restaurant")
    .select("-__v");
  res.send(foodMenuList);
});

// GET_request (GET ALL FOOD-ITEMS LIST FROM DATABASE)
router.get(`/items?:restaurantId`, async (req, res) => {    // "items" added
  const restaurantId = req.query.restaurantId; //new added
  const foodMenuList = await FoodMenu.find({ restaurant: req.body.restaurant })
    .populate("restaurant")
    .select("-__v");
  res.send(foodMenuList);
});

// GET_request (GET PARTICULAR FOOD_ITEM FROM DATABASE)
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid foodMenu ID !!!");
  }
  const foodMenu = await FoodMenu.findById(req.params.id)
    .populate("restaurant")
    .select("-__v");
  if (!foodMenu) {
    res.status(500).json({
      success: false,
      message: "The food-item with the given ID was not found !!!",
    });
    return;
  }
  res.status(200).send(foodMenu);
});

// GET_request (GET TOTAL(count) FOOD_ITEM FROM DATABASE)
router.get(`/get/count`, async (req, res) => {
  const foodMenuCount = await FoodMenu.estimatedDocumentCount();
  if (!foodMenuCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    foodMenuCount: foodMenuCount,
  });
});

// POST_request (ADD NEW FOOD_ITEM TO DATABASE)
router.post("/", uploadOptions.single("image"), async (req, res) => {
  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant) {
    return res.status(400).send("Invalid Restaurant !!!");
  }

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let foodMenu = new FoodMenu({
    name: req.body.name,
    image: `${basePath}${fileName}`,
    price: req.body.price,
    description: req.body.description,
    restaurant: req.body.restaurant,
    date: req.body.date,
  });
  foodMenu = await foodMenu.save();

  if (!foodMenu) {
    return res.status(500).send("The food-item can't be created !!!");
  }

  res.send(foodMenu);
});

// PUT_request (UPDATE PARTICULAR FOOD_ITEM IN DATABASE)
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid foodMenu ID !!!");
  }
  // const restaurant = await Restaurant.findById(req.body.restaurant);
  // if (!restaurant) {
  //   return res.status(400).send("Invalid Restaurant !!!");
  // }
  const foodExist = await FoodMenu.findById(req.params.id);
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${fileName}`; // if new image provided for update (update old image with new one)
    
  } else {
    imagePath = foodExist.image; // no change in old image
  }
  const foodMenu = await FoodMenu.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: imagePath,
      price: req.body.price,
      description: req.body.description,
      // restaurant: req.body.restaurant,
      date: req.body.date,
    },
    { new: true }
  );
  if (!foodMenu) {
    return res.status(400).send("The food-item can't be updated !!!");
  }

  res.send(foodMenu);
});

// DELETE_request (REMOVE PARTICULAR FOOD_ITEM FROM DATABASE)
router.delete("/:id", (req, res) => {
  FoodMenu.findByIdAndRemove(req.params.id)
    .then((foodMenu) => {
      if (foodMenu) {
        return res
          .status(200)
          .json({ success: true, message: "The food-item is deleted !!!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The food-item not found !!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

///-------------------------------------------

module.exports = router;
