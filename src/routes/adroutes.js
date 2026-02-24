const express = require("express");

const router = express.Router();

const adController =
require("../controllers/adcontroller");

router.post(

"/generate",

adController.generateAd

);

module.exports = router;