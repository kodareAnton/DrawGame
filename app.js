var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server); 

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

io.on("connection", function(socket){
    console.log("user connected");

    socket.on("disconnected", function(){
        console.log("user disconnected");
    })

    socket.on("draw", function(draw){
        console.log("draw");

        io.emit("draw", draw);
    })
})

module.exports = {app: app, server: server};
