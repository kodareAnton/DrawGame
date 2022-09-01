var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

const PNG = require("pngjs").PNG;

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

const pixelmatch = require("pixelmatch");
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
let arrayFromSocketRoom1 = [];

let arrayOfFinished = [];
let arrayOfFinished1 = [];

io.on("connection", function (socket) {
  console.log("user connected");

  // Botten välkommnar
  const botName = "Bot Janne ";
  let username = "";
  socket.emit("message", "Välkommen!", botName);

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(users, socket.id, username, room);
    users.push(user);
    usersArray.push(user);
    username = username;
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

    // let arrayFromSocketRoom1=[]

    //Spelare klar med sin bild
    socket.on("finishedUser", function (socketID) {
      console.log(Array.from(io.sockets.adapter.rooms));
      let arrayFromSocket = Array.from(io.sockets.adapter.rooms);

      arrayFromSocketRoom = arrayFromSocket.filter(el => el.includes("Room"));
      // arrayFromSocketRoom1 = arrayFromSocket.filter(el => el.includes("Room1"));
      // );
      // let arrayFromSocketRoom2 = arrayFromSocket.filter((el) =>
      //   el.includes("Room2")
      // );
      // let arrayFromSocketRoom3 = arrayFromSocket.filter((el) =>
      //   el.includes("Room3")
      // );
      // let arrayFromSocketRoom4 = arrayFromSocket.filter((el) =>
      //   el.includes("Room4")
      // );

      arrayFromSocketRoom[0][1].forEach(socketInRoom => {
        if (arrayOfFinished.length > 4) {
          arrayOfFinished = [];
        }

        if (socketInRoom === socketID) {
          arrayOfFinished.push(socketInRoom);
        }
      });
      // arrayFromSocketRoom1[0][1].forEach(socketInRoom => {
      //   if (arrayOfFinished.length > 4) {
      //     arrayOfFinished = [];
      //   }

      //   if (socketInRoom === socketID) {
      //     console.log("Är jag här");
      //     arrayOfFinished1.push(socketInRoom);
      //   }
      // });

      // console.log(arrayFromSocketRoom1);
      // console.log(arrayFromSocketRoom2);
      // console.log(arrayFromSocketRoom3);
      // console.log(arrayFromSocketRoom4);
      // console.log(arrayFromSocketRoom5);
      io.to("Room").emit("finishedUser", arrayOfFinished);
      // io.to("Room1").emit("finishedUser", arrayOfFinished1);
    });
    socket.on("finishedImages", function (image, facitImg) {
      console.log(image);
      console.log(facitImg);
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
