const express = require("express");
<<<<<<< HEAD

const router = express.Router();

const adController =
require("../controllers/adcontroller");

router.post(

"/generate",

adController.generateAd

);
=======
const router = express.Router();
const multer = require("multer");
const path = require("path");

const adController = require("../controllers/adcontroller");

// upload config
const upload = multer({
  dest: "generated/assets/"
});

// generate ad
router.post("/generate", upload.single("logo"), adController.generateAd);

// get ads
router.get("/", adController.getAds);

// delete ad
router.delete("/:id", adController.deleteAd);
>>>>>>> bf9b5e3432a6c0d2e38dabf24a98689efbf8348f

module.exports = router;