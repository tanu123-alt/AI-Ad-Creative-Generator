const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const adController = require("../controllers/adcontroller");

// upload config — use absolute path so multer works from any working directory

const upload = multer({
  dest: path.join(__dirname, "../../generated/assets/")
});

// generate ad
router.post("/generate", upload.single("logo"), adController.generateAd);

// get ads
router.get("/", adController.getAds);

// delete ad
router.delete("/:id", adController.deleteAd);

module.exports = router;