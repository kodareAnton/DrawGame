var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var imagesRouter = require("./routes/images")

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/images", imagesRouter);

async function init() {
    try {
        await mongoose.connect("mongodb://localhost:27017/drawgamegallery")
        console.log("connected to database")
    } catch (error) {
        console.log("error" + error);
    }
    app.listen(4000);
}

init();



module.exports = app;
