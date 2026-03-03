const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/generated", express.static(path.join(__dirname, "generated")));

/* ROUTES */

app.use("/api/ad", require("./src/routes/adroutes"));


/* DEBUG LINE */

console.log("Mongo URI:", process.env.MONGO_URI);


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