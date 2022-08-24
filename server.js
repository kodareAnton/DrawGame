var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

app.use(express.static("./public"));

http.listen(port, () => {
  console.log("server is running on " + port);
});
