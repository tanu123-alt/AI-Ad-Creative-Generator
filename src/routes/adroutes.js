const express = require("express");
const router = express.Router();

const { generateAd } = require("../controllers/adcontroller");

router.post("/generate-ad", generateAd);

module.exports = router;