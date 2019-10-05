const express = require("express");
const { Meme } = require("../models/meme");
const router = express.Router();



router.get("/", async (req, res)=>{
    const memes = await Meme.find();
    
    res.send(memes);

});
router.post("/", async( req, res)=>{
    const meme = new Meme({
        name: req.body.name,
        img: req.body.img,
        textInfo: req.body.textInfo
    });


    meme.save();
    res.send(meme);
});

router.get("/:string", async(req, res)=>{
    const regex = new RegExp(`.*${req.params.string}.*`, "gi");
    const memes = await Meme.find().or([
        {tags: regex},
        {name: regex}
    ]);

    res.send(memes);

});

module.exports = router;