var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var imagesRouter = require("./routes/images");
var cors = require("cors");
const {
  userJoin,
  userLeave,
  getRoomUsers,
  getRoomAllUsers,
} = require("./public/modules/user");

var app = express();
app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);
// const fs = require('fs');
// const PNG = require('pngjs').PNG;
var pixelmatch = require("pixelmatch");
// module.exports = pixelmatch;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/images", imagesRouter);

/* Startar igång servern och ansluter till mongoose */
//TODO ändra till HEROKU adress sedan?
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
//Array med alla användare från start session
let users = [];
//Array med aktuella användare
let usersArray = [];

let arrayFromSocketRoom = [];

let arrayOfFinished = [];

//Skapar random siffror som bestämmer vilken facitbild som ska visas
function randomNumber() {
  let randomNumberResult = Math.floor(Math.random() * 4);
  console.log(randomNumberResult);
  return randomNumberResult;
}

//Variablen ändras vid varje connection men för att den ska vara
//samma för alla i ett rum används den som skapats av den sista av dem som connectats.
let randomNumber3;

io.on("connection", function (socket) {
  console.log("user connected");

  // Botten välkommnar
  const botName = "Bot Janne ";
  let username = "";
  socket.emit("message", "Välkommen!", botName);

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(usersArray, socket.id, username, room);
    users.push(user);
    usersArray.push(user);
    username = username;
    randomNumber3 = randomNumber();
    console.log(randomNumber3);
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
      allUsersFromStart: getRoomAllUsers(users, user.playRoom),
    });

    //Skicka användare och rum
    io.to(user.playRoom).emit("roomUsers", {
      room: user.playRoom,
      allUsersInRoom: getRoomUsers(usersArray, user.playRoom),
    });

    //Spelplanen men spelarens drag
    socket.on("draw", function (draw) {
      io.emit("draw", draw);
    });

    //Spelare klar med sin bild
    socket.on("finishedUser", function (socketID) {
      console.log(Array.from(io.sockets.adapter.rooms));
      let arrayFromSocket = Array.from(io.sockets.adapter.rooms);
      console.log("RUMMET" + user.playRoom);
      console.log(arrayOfFinished.length);
      console.log(
        users.filter((user1) => user1.playRoom.includes(user.playRoom))
      );
      //.filter((user1) => user1.includes(user.playRoom))
      arrayFromSocketRoom = arrayFromSocket.filter((el) =>
        el.includes(user.playRoom)
      );

      arrayFromSocketRoom[0][1].forEach((socketInRoom) => {
        if (socketInRoom === socketID) {
          console.log(arrayOfFinished);
          arrayOfFinished.push(socketInRoom);
          console.log(arrayOfFinished);
        }
      });
      console.log("HÄR");
      console.log(typeof arrayOfFinished.length);
      console.log(
        typeof usersArray.filter((user1) =>
          user1.playRoom.includes(user.playRoom)
        ).length
      );
      console.log(
        arrayOfFinished.length ===
          usersArray.filter((user1) => user1.playRoom.includes(user.playRoom))
      );
      if (
        arrayOfFinished.length ===
        usersArray.filter((user1) => user1.playRoom.includes(user.playRoom))
          .length
      ) {
        let booleanFinished = true;
        io.to(user.playRoom).emit("finishedUser", booleanFinished);
        arrayOfFinished = [];
      } else {
        let booleanFinished = false;
        io.to(user.playRoom).emit("finishedUser", booleanFinished);
      }
    });
    socket.on("finishedImages", function (image, facitImg) {
      console.log(image);
      console.log(facitImg);
    });

    socket.on("getRandomImage", function () {
      console.log(Array.from(io.sockets.adapter.rooms));

      let arrayInRoom = Array.from(io.sockets.adapter.rooms);
      const filteredRooms = arrayInRoom.filter((room) => !room[1].has(room[0]));
      console.log(Array.from(filteredRooms[0][1]).length);
      if (Array.from(filteredRooms[0][1]).length === 4) {
        let randomNumberFromSocket = randomNumber3;

        console.log(randomNumberFromSocket);
        socket.to(user.playRoom).emit("getRandomImage", randomNumberFromSocket);
      }
    });
  });

  //Användare lämnar
  socket.on("disconnect", () => {
    // Bot Janne skickar meddelande om att username har lämnat
    socket.broadcast.emit("message", username + " lämnade chatten!", botName);
    console.log(socket.id + "User disconnected");
    const user = userLeave(usersArray, socket.id);
    if (user) {
      // Skicka uppdaterad rum-info
      io.to(user.playRoom).emit("roomUsers", {
        room: user.playRoom,
        allUsersInRoom: getRoomUsers(usersArray, user.playRoom),
      });
    }
  });
});

module.exports = { app: app, server: server };
