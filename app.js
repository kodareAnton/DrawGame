var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var imagesRouter = require("./routes/images")
var cors = require("cors")
// const http = require("http").createServer(app);

var app = express();
app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/images", imagesRouter);

/* Startar igång servern och ansluter till mongoose */
 async function init() {
  try {
      await mongoose.connect("mongodb://localhost:27017/drawgamegallery")
      console.log("connected to database")
  } catch (error) {
     console.log("error" + error);
}
  server.listen(3000)

}

 init();

let users = [];

let userColor;

//Användare ansluter
function userJoin(id, username, room) {
  console.log("HÄR ÄR VI" + users);
  if (users.length === 0 || users.length === 4 || users.length === 8) {
    userColor = "blue";
  } else if (users.length === 1 || users.length === 5 || users.length === 9) {
    userColor = "green";
  } else if (users.length === 2 || users.length === 6 || users.length === 10) {
    userColor = "yellow";
  } else if (users.length === 3 || users.length === 7 || users.length === 11) {
    userColor = "red";
  }
  const user = { id, username, room, userColor };
  users.push(user);
  return user;
}

//Användare lämnar chat

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

io.on("connection", function (socket) {
  console.log("user connected");

  socket.on("joinRoom", ({ username, room }) => {
    console.log("Vill också se" + socket.id);
    let playRoom;
    console.log(Array.from(io.sockets.adapter.rooms).length);
    if (5 >= Array.from(io.sockets.adapter.rooms).length > 0) {
      playRoom = room;
    }
    if (
      Array.from(io.sockets.adapter.rooms).length > 5 &&
      Array.from(io.sockets.adapter.rooms).length <= 10
    ) {
      playRoom = room + "1";
    } else if (Array.from(io.sockets.adapter.rooms).length > 10) {
      playRoom = room + "2";
    }

    const user = userJoin(socket.id, username, playRoom);

    console.log(
      "Vill se " +
        user.userColor +
        " " +
        user.username +
        " " +
        user.room +
        " " +
        socket.id
    );
    socket.join(user.room);
    socket.on("message", (message, nickname) => {
      console.log(message, nickname, socket.id);
      io.in(user.room).emit("message", message, nickname, socket.id,user.userColor);
    });
    
  });

 

  //Användare lämnar
  socket.on("disconnect", () => {
    console.log(socket.id + "User disconnected");
    const user = userLeave(socket.id);
  });
});

module.exports = { app: app, server: server };
