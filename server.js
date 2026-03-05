require('dns').setDefaultResultOrder('ipv4first');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
// serve generated images
app.use("/generated", express.static(path.join(__dirname, "generated")));


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

app.listen(5000, () => {

console.log("Server running on port 5000");

});