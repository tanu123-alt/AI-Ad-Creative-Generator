require("dotenv").config();
require("dns").setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const app = express();

/* Environment variables */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* CORS */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Static folder for generated images */
app.use("/generated", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "generated")));

/* Rate limiter */
const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many requests. Please wait a minute before generating again." }
});

app.use("/api/ad/generate", generateLimiter);

/* Routes */
app.use("/api/ad", require("./src/routes/adroutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

/* MongoDB Connection */
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.log("MongoDB Connection Failed");
    console.log(err);
  });

/* Server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

