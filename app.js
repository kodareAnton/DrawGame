var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var imagesRouter = require("./routes/images");
var cors = require("cors");
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
    await mongoose.connect("mongodb://localhost:27017/drawgamegallery");
    console.log("connected to database");
  } catch (error) {
    console.log("error" + error);
  }
  server.listen(3000);
}

init();

let users = [];
let usersArray = [];

let userColor;
let playRoom;

//Användare ansluter
function userJoin(id, username, room) {
  console.log("HÄR ÄR VI" + users);

  if (users.length <= 3) {
    playRoom = room;
  } else if (users.length > 3 && users.length <= 7) {
    playRoom = room + "1";
  } else if (users.length >= 7) {
    playRoom = room + "2";
  }

  if (users.length === 0 || users.length === 4 || users.length === 8) {
    userColor = "blue";
  } else if (users.length === 1 || users.length === 5 || users.length === 9) {
    userColor = "green";
  } else if (users.length === 2 || users.length === 6 || users.length === 10) {
    userColor = "yellow";
  } else if (users.length === 3 || users.length === 7 || users.length === 11) {
    userColor = "red";
  }
  const user = { id, username, playRoom, userColor };
  users.push(user);
  usersArray.push(user);
  console.log(users);
  console.log(usersArray);
  console.log(Array.from(io.sockets.adapter.rooms));
  return user;
}

//Användare lämnar chat

function userLeave(id) {
  const index = usersArray.findIndex((user) => user.id === id);

  if (index !== -1) {
    return usersArray.splice(index, 1)[0];
  }
}

//get room users
function getRoomUsers(playRoom) {
  return usersArray.filter((user) => user.playRoom === playRoom);
}

function getRoomAllUsers(playRoom) {
  console.log(users);
  return users.filter((user) => user.playRoom === playRoom);
}

io.on("connection", function (socket) {
  console.log("user connected");

  // Botten välkommnar
  const botName = "Bot Janne ";
  socket.emit("message", "Välkommen!", botName);

  socket.on("joinRoom", ({ username, room }) => {
    console.log("Vill också se" + socket.id);

    const user = userJoin(socket.id, username, room);

    // Skickar att username har joinat rummet
    socket.broadcast.emit("message", username + " har joinat rummet!", botName);
    console.log(
      "Vill se " +
        user.userColor +
        " " +
        user.username +
        " " +
        user.playRoom +
        " " +
        socket.id
    );
    socket.join(user.playRoom);
    socket.on("message", (message, nickname) => {
      console.log(message, nickname, socket.id);

      io.in(user.playRoom).emit(
        "message",
        message,
        nickname,
        socket.id,
        user.userColor
      );
    });

    //Skicka användare och rum från originallista
    io.to(user.playRoom).emit("usersFromStart", {
      allUsersFromStart: getRoomAllUsers(user.playRoom),
    });

    //Skicka användare och rum
    io.to(user.playRoom).emit("roomUsers", {
      room: user.playRoom,
      allUsersInRoom: getRoomUsers(user.playRoom),
    });
  });

  //Användare lämnar
  socket.on("disconnect", () => {
    // Bot Janne skickar meddelande om att username har lämnat
    socket.broadcast.emit("message", username + " lämnade chatten!", botName);
    console.log(socket.id + "User disconnected");
    const user = userLeave(socket.id);
    if (user) {
      // Skicka uppdaterad rum-info
      io.to(user.playRoom).emit("roomUsers", {
        room: user.playRoom,
        allUsersInRoom: getRoomUsers(user.playRoom),
      });
    }
  });
});

module.exports = { app: app, server: server };
