require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

const generatedDir = path.join(__dirname, 'generated');
const assetsDir = path.join(generatedDir, 'assets');

// Ensure the generated directories exist
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve generated images with Cross-Origin-Resource-Policy so canvas crossOrigin works
// (cors() middleware above already handles Access-Control-Allow-Origin)
app.use("/generated", (req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(generatedDir));

/* ROUTES */
app.use("/api/ad", require("./src/routes/adroutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

/* MONGODB CONNECT */
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected Successfully");
})
.catch((err) => {
  console.log("MongoDB Connection Failed");
  console.log(err);
});

/* SERVER */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});