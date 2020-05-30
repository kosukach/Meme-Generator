import express from "express";
import mongoose from "mongoose";
import config from "config";
import memes from "./routers/memes.js";
/*const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const memes = require("./routers/memes");*/
const app = express();

app.use(express.static("./public"));
app.use(express.json());
app.use("/memes", memes);

mongoose.connect(process.env.MONGODB_URI || config.get("db"), { useNewUrlParser: true })
  .then(() => console.log(`Connected to ${config.get("db")}...`))
  .catch((ex)=> console.log(ex));

let  port = process.env.PORT || 8080;
app.listen(port, ()=> {console.log(`listening on port ${port}`);});

