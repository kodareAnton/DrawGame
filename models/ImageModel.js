const mongoose = require("mongoose");

const schema = mongoose.Schema({
    imageUrl: String
})

module.exports = mongoose.model("image", schema);