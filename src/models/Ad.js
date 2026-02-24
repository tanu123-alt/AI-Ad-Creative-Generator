const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({

  product: {
    type: String,
    required: true
  },

  audience: {
    type: String,
    required: true
  },

  platform: {
    type: String,
    required: true
  },

  headline: {
    type: String
  },

  caption: {
    type: String
  },

  hashtags: {
    type: String
  },

  image: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Ad", adSchema);