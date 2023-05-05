// Import Statements...
const { TiffinService } = require("../models/tiffinService");
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
    cb(null, `TiffinService-${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
//------------------------------------------------------------

/// APIS Calling------------------------------
// GET_request (GET ALL TIFFIN-SERVICES LIST FROM DATABASE)
router.get(`/`, async (req, res) => {
  const tiffinServiceList = await TiffinService.find().select("-__v");
  if (!tiffinServiceList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(tiffinServiceList);
});

// GET_request (GET PARTICULAR TIFFIN-SERVICE FROM DATABASE)
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid tiffin-service ID !!!");
  }
  const tiffinService = await TiffinService.findById(req.params.id).select(
    "-__v"
  );
  if (!tiffinService) {
    res.status(500).json({
      message: "The tiffin-service with the given ID was not found !!!",
    });
    return;
  }
  res.status(200).send(tiffinService);
});

// GET_request (GET TOTAL(count) TIFFIN-SERVICES FROM DATABASE)
router.get(`/get/count`, async (req, res) => {
  const tiffinServiceCount = await TiffinService.estimatedDocumentCount();
  if (!tiffinServiceCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    tiffinServiceCount: tiffinServiceCount,
  });
});

// POST_request (ADD NEW TIFFIN-SERVICE TO DATABASE)
router.post("/", uploadOptions.single("image"), async (req, res) => {
  
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let tiffinService = new TiffinService({
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
  tiffinService = await tiffinService.save();

  if (!tiffinService) {
    return res.status(400).send("The tiffin-service can't be created !!!");
  }

  res.send(tiffinService);
});

// PUT_request (UPDATE PARTICULAR TIFFIN-SERVICE-DATA IN DATABASE)
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid tiffinMenu ID !!!");
  }
  const tiffinServiceExist = await TiffinService.findById(req.params.id);
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${fileName}`; // if new image provided for update (update old image with new one)
    
  } else {
    imagePath = tiffinServiceExist.image; // no change in old image
  }
  const tiffinService = await TiffinService.findByIdAndUpdate(
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
  if (!tiffinService) {
    return res.status(400).send("The tiffin-service can't be updated !!!");
  }

  res.send(tiffinService);
});

// DELETE_request (REMOVE PARTICULAR TIFFIN-SERVICE FROM DATABASE)
router.delete("/:id", (req, res) => {
  TiffinService.findByIdAndRemove(req.params.id)
    .then((tiffinService) => {
      if (tiffinService) {
        return res.status(200).json({
          success: true,
          message: "The tiffin-service is deleted !!!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "The tiffin-service not found !!!",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
///-------------------------------------------

// Export Statements...
module.exports = router;
