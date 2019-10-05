const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const fs = require("fs");
const memes = require("./routers/memes");
const multer = require("multer");




const app = express();


app.use(express.static("./public"));
app.use(express.json());
app.use("/memes", memes);

mongoose.connect(config.get("db"), { useNewUrlParser: true })
  .then(() => console.log(`Connected to ${config.get("db")}...`))
  .catch((ex)=> console.log(ex));


let  port = 5000;
app.listen(port, ()=> {console.log(`listening on port ${port}`);});
