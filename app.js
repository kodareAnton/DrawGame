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

const { REPL_MODE_SLOPPY } = require("repl");
const { reverse } = require("dns");

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
    await mongoose.connect(
      "mongodb+srv://Grupp7:Z69tj9Pefto9DH3Z@drawgame.zmgezh5.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("connected to database");
  } catch (error) {
    console.log("error" + error);
  }
  server.listen(process.env.PORT || 3000);
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
  console.log("RANDOM NUMBER" + randomNumberResult);
  return randomNumberResult;
}

//Variablen ändras vid varje connection men för att den ska vara
//samma för alla i ett rum används den som skapats av den sista av dem som connectats.
let randomNumber3;

let counterRoom = 1;

let playRoom = "Room";

let numberForColor;

io.on("connection", function (socket) {
  console.log("user connected");

  // Botten välkommnar
  const botName = "Bot Janne ";
  let username = "";

  //joinar rum
  socket.on("joinRoom", ({ username }) => {
    let arrayFromSocket = Array.from(io.sockets.adapter.rooms);

    // aktuella i rummen (en lista med listor med varje rum)
    arrayFromSocketRoom = arrayFromSocket.filter(
      (room) => !room[1].has(room[0])
    );

    console.log("RUMMEN MED DELTAGARE");
    console.log(arrayFromSocketRoom);
    //Logik för att skapa dynamiska rum
    if (arrayFromSocketRoom.length !== 0) {
      //Vänder för att få tag i sista rummet i arrayn
      let reversedArray = arrayFromSocketRoom.reverse()[0];
      console.log("VÄND ARRAY");
      console.log(reversedArray);
      //Deltagar i rummet
      let arrayRoomsReversed = reversedArray[1];
      //Lista på det rummet som är sist och join för att annars är alla bokstäver i room vars en lista
      let actualRoom = Array.from(reversedArray[0]).join("");
      //Längd på listan av deltagare i sista rummet
      let booleanArray = users.filter(
        (user) => user.playRoom === actualRoom
      ).length;
      //Om userBoolean är true, alltså att denna lista är fyra (fullt rum) så ska namnet öka med en siffra
      userBoolean = booleanArray === 4;
      //Namn på rum
      let roomName = reversedArray[0];
      console.log("Namn på rum" + roomName);
      let arrayRoomReversedLength = arrayRoomsReversed.length === 4;
      //Om userslistan i rummets längd eller socketlistan i rummets längd är 4 så ökas
      //variablen med en till siffra.
      if (arrayRoomReversedLength === 4 || userBoolean === true) {
        playRoom = roomName + (counterRoom++).toString();
      }
    }

    console.log("DELTAGARE I AKTUELLT RUM");
    console.log(
      usersArray.filter((user1) => user1.playRoom === playRoom).length
    );

    let listForColor = usersArray.filter(
      (user1) => user1.playRoom === playRoom
    ).length;

    if (listForColor === 0) {
      numberForColor = 0;
    } else if (listForColor === 1) {
      numberForColor = 1;
    } else if (listForColor === 2) {
      numberForColor = 2;
    } else if (listForColor === 3) {
      numberForColor = 3;
    }

    const user = userJoin(
      usersArray,
      socket.id,
      username,
      playRoom,
      numberForColor
    );

    socket.emit("message", "Välkommen!", botName);

    //Push till lista med alla användare sedan sessionen startade
    users.push(user);
    //Push till dynamisk lista som uppdateras vid disconnect
    usersArray.push(user);

    username = username;

    //Skapar random number som gäller i samma rum, körs en gång för varje socket
    //men det är sista siffran som används i samtliga rum
    randomNumber3 = randomNumber();

    // Skickar att username har joinat rummet
    socket.broadcast
      .to(user.playRoom)
      .emit("message", username + " har joinat rummet!", botName);
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
      io.to(user.playRoom).emit("draw", draw);
    });

    //Spelare klar med sin bild
    socket.on("finishedUser", function (socketID) {
      let arrayFromSocket = Array.from(io.sockets.adapter.rooms);

      arrayFromSocketRoom = arrayFromSocket.filter((el) =>
        el.includes(user.playRoom)
      );

      arrayFromSocketRoom[0][1].forEach((socketInRoom) => {
        if (socketInRoom === socketID) {
          arrayOfFinished.push(socketInRoom);
        }
      });

      if (
        arrayOfFinished.length ===
        usersArray.filter((user1) => user1.playRoom === user.playRoom).length
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

    //Variablen randomNumber 3 används för att visa upp samma facitbild för samtliga

    socket.on("getRandomImage", function () {
      let arrayFilteredRooms = users.filter(
        (user1) => user1.playRoom === user.playRoom
      ).length;

      if (arrayFilteredRooms === 4) {
        let randomNumberFromSocket = randomNumber3;

        console.log(randomNumberFromSocket);
        socket.to(user.playRoom).emit("getRandomImage", randomNumberFromSocket);
      }
    });
  });

  //Användare lämnar
  socket.on("disconnect", () => {
    const user = userLeave(usersArray, socket.id);
    // Bot Janne skickar meddelande om att username har lämnat

    if (user) {
      socket.broadcast
        .to(user.playRoom)
        .emit("message", user.username + " lämnade chatten!", botName);
      console.log(socket.id + "User disconnected");
      // Skicka uppdaterad rum-info
      io.to(user.playRoom).emit("roomUsers", {
        room: user.playRoom,
        allUsersInRoom: getRoomUsers(usersArray, user.playRoom),
      });
    }

    let emptyRoom = Array.from(io.sockets.adapter.rooms).filter(
      (room) => !room[1].has(room[0])
    );

    console.log(emptyRoom.length);
    console.log(users);
    if (emptyRoom.length === 0) {
      users = [];
      playRoom = "Room";
    }
    console.log(users);
  });
});

module.exports = { app: app, server: server };
