var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

app.use(express.static("./public"));

io.on("connection", socket => {
  console.log("user connected");
  console.log(io.sockets.adapter.rooms);

  socket.on("join", roomToJoin => {
    console.log("Gick med i rum:" + roomToJoin);
    socket.join(roomToJoin);
    console.log(io.sockets.adapter.rooms);
  });

  socket.on("message", (message, nickname, room) => {
    console.log(message, nickname, room);
    io.in(room).emit("message", message, nickname, socket.id);
  });

  socket.on("disconnected", () => {
    console.log("user disconnected...");
  });
});

http.listen(port, () => {
  console.log("server is running on " + port);
});
