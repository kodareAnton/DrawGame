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
    await mongoose.connect("mongodb+srv://Grupp7:Z69tj9Pefto9DH3Z@drawgame.zmgezh5.mongodb.net/?retryWrites=true&w=majority");
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
