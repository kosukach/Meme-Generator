import mongoose from "mongoose";

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
        height: Number,
        width: Number
    }]
    
});

const Meme = mongoose.model("Meme", memeSchema);

export default Meme;
