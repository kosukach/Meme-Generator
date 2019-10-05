const mongoose = require("mongoose");

const memeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    textInfo: [{
        x: Number,
        y: Number,
        lineWidth: Number
    }]
    
});

const Meme = mongoose.model("Meme", memeSchema);

module.exports.Meme = Meme;
