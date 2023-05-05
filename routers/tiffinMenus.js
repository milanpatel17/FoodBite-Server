// Import Statements...
const { TiffinMenu } = require("../models/tiffinMenu");
const express = require("express");
const { TiffinService } = require("../models/tiffinService");
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
    cb(null, `TiffinItem-${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
//------------------------------------------------------------

/// APIS Calling------------------------------
// GET_request (GET ALL TIFFIN_ITEMS LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const tiffinMenuList = await TiffinMenu.find()
    .populate("tiffin_service")
    .select("-__v");
  res.send(tiffinMenuList);
});

// GET_request (GET PARTICULAR TIFFIN_ITEM FROM DATABASE)
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid tiffinMenu ID !!!");
  }
  const tiffinMenu = await TiffinMenu.findById(req.params.id)
    .populate("tiffin_service")
    .select("-__v");
  if (!tiffinMenu) {
    res.status(500).json({
      success: false,
      message: "The tiffin-item with the given ID was not found !!!",
    });
    return;
  }
  res.status(200).send(tiffinMenu);
});

// GET_request (GET TOTAL(count) TIFFIN_ITEM FROM DATABASE)
router.get(`/get/count`, async (req, res) => {
  const tiffinMenuCount = await TiffinMenu.estimatedDocumentCount();
  if (!tiffinMenuCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    tiffinMenuCount: tiffinMenuCount,
  });
});

// POST_request (ADD NEW TIFFIN_ITEM TO DATABASE)
router.post("/",  uploadOptions.single("image"),async (req, res) => {
  const tiffin_service = await TiffinService.findById(req.body.tiffin_service);
  if (!tiffin_service) {
    return res.status(400).send("Invalid TiffinService !!!");
  }

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let tiffinMenu = new TiffinMenu({
    name: req.body.name,
    image: `${basePath}${fileName}`,
    price: req.body.price,
    description: req.body.description,
    tiffin_service: req.body.tiffin_service,
    date: req.body.date,
  });
  tiffinMenu = await tiffinMenu.save();

  if (!tiffinMenu) {
    return res.status(500).send("The tiffin-item can't be created !!!");
  }

  res.send(tiffinMenu);
});

// PUT_request (UPDATE PARTICULAR TIFFIN_ITEM IN DATABASE)
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid tiffinMenu ID !!!");
  }
  // const tiffinService = await TiffinService.findById(req.body.tiffinService);
  // if (!tiffinService) {
  //   return res.status(400).send("Invalid TiffinService !!!");
  // }
  const tiffinExist = await TiffinMenu.findById(req.params.id);
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${fileName}`; // if new image provided for update (update old image with new one)
    
  } else {
    imagePath = tiffinExist.image; // no change in old image
  }
  const tiffinMenu = await TiffinMenu.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: imagePath,
      price: req.body.price,
      description: req.body.description,
      // tiffin_service: req.body.tiffin_service,
      date: req.body.date,
    },
    { new: true }
  );
  if (!tiffinMenu) {
    return res.status(400).send("The tiffin-item can't be updated !!!");
  }

  res.send(tiffinMenu);
});

// DELETE_request (REMOVE PARTICULAR TIFFIN_ITEM FROM DATABASE)
router.delete("/:id", (req, res) => {
  TiffinMenu.findByIdAndRemove(req.params.id)
    .then((tiffinMenu) => {
      if (tiffinMenu) {
        return res
          .status(200)
          .json({ success: true, message: "The tiffin-item is deleted !!!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The tiffin-item not found !!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
///-------------------------------------------

module.exports = router;
