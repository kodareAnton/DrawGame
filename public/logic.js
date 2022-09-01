import {
  getSquare,
  getColor,
  drawGrid,
  fillSquare,
} from "./modules/canvas.mjs";
import { allChatElements, sendBtnFunction, userColorStyle } from "./modules/chat.mjs";
import {
  leaveGame,
  outputUsers,
  startGameOnUser,
  startGame,
} from "./modules/login.js";


let socket = io();

socket.on("connect", () => {
  console.log(socket.id + " A user joined");
});

//Header element
let header = document.getElementById("header");
header.classList = "header";
let containerUserList = document.createElement("span");
containerUserList.classList = "containerUserList";

let headingUserList = document.createElement("h2");
headingUserList.classList = "headingUserList";
headingUserList.innerText = "Användare inloggade:";

let userList = document.createElement("ul");
userList.id = "userList";

let logOutBtn = document.createElement("button");
logOutBtn.innerText = "Lämna spel";
logOutBtn.classList = "logOutBtn";

//Login element
let root = document.getElementById("root");
let main = document.createElement("main");
main.className = "main";

let containerWelcome = document.createElement("div");
containerWelcome.className = "containerWelcome";
let heading = document.createElement("h1");
heading.innerText = "Välkommen till PaintGame";
let loginMessage = document.createElement("p");
loginMessage.innerText = "Skriv in användarnamn och börja måla!";

let containerForm = document.createElement("div");
containerForm.classList = "containerForm";

let inputUser = document.createElement("input");
inputUser.type = "text";
inputUser.name = "username";
inputUser.id = "inputUser";
inputUser.placeholder = "Användarnamn";
inputUser.required = true;

let buttonGoToRoom = document.createElement("button");
buttonGoToRoom.innerText = "Starta spel";

//spelrumselement

let waitBanner = document.getElementById("waitBanner");
waitBanner.innerText = "Vi väntar på fler spelare!";

//Appends
root.append(main);
header.append(containerUserList, logOutBtn);
main.append(containerWelcome, containerForm);
containerWelcome.append(heading, loginMessage);
containerForm.append(inputUser, buttonGoToRoom);
containerUserList.append(headingUserList, userList);

//Lista med alla användare i rummet
let userArray = [];

//Användarnamn
var nickname = "";
let username;

//startknapp som skickar användare och rum
buttonGoToRoom.addEventListener("click", function () {
  let room = "Room";
  username = inputUser.value;
  nickname = username;
  startGame(username);
  socket.emit("joinRoom", { username, room });
});
logOutBtn.addEventListener("click", leaveGame);

//Få alla användare från början av sessionen
socket.on("usersFromStart", ({ allUsersFromStart }) => {
  startGameOnUser(allUsersFromStart);
});

//Få alla rum och användare uppdaterad lista
socket.on("roomUsers", ({ room, allUsersInRoom }) => {
  outputUsers(allUsersInRoom);
  for (let i = 0; i < allUsersInRoom.length; i++) {
    userArray.push(allUsersInRoom[i]);
  }
});

// //CANVAS
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
drawGrid(context);

//Eventlyssnaren som kör funktionerna vid musklick
canvas.addEventListener(
  "click",
  function (evt) {
    let thisUser = userArray.find((x) => x.id === socket.id);
    console.log(thisUser.userColor);
    //Hämtar positionen för klickad ruta
    var mousePos = getSquare(canvas, evt);

    //Hämtar färgen för klickad ruta
    var color = getColor(context, mousePos.x, mousePos.y);

    //Färglägger klickad ruta
    fillSquare(context, mousePos.x, mousePos.y, color, thisUser.userColor);

    //Konverterar canvas till URL och skickar spelplansURL med socket
    var canvasURL = canvas.toDataURL();
    socket.emit("draw", canvasURL);
  },
  false
);
//Tar emot och ritar upp spelplanen med spelarens drag
socket.on("draw", function (draw) {
  var img = new Image();
  img.onload = start;
  img.src = draw;
  function start() {
    context.drawImage(img, 0, 0);
  }
});

/* Sparar bilden */
let saveBtn = document.createElement("button");
saveBtn.className = "saveBtn";
saveBtn.id = "saveBtn";
let saveBtnText = "Spara bilden";
document.getElementById("btnContainer").append(saveBtn);
saveBtn.append(saveBtnText);

// saveBtn.append(saveBtnText)
// document.body.append(saveBtn);

saveBtn.addEventListener("click", async (e) => {
  // Konverterar bilden till en sträng
  const link = document.createElement("a");
  link.download = "download.png";
  link.href = canvas.toDataURL();
  // link.click();
  // link.delete;
  let imgToSave = { imageUrl: link.href };
  console.log(imgToSave);

  let response = await fetch("http://localhost:3000/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgToSave),
  });

  console.log(response);
});

/* Galleriet */

let galleryBtn = document.createElement("button");
let galleryBtnText = "Visa galleri";

let imageContainer = document.createElement("div");
imageContainer.classList.add("imageContainer");

galleryBtn.addEventListener("click", async () => {
  try {
    let response = await fetch("http://localhost:3000/images");
    console.log(response);
    let data = await response.json();

    renderImages(data);
  } catch (error) {
    console.log(error);
  }
});

galleryBtn.append(galleryBtnText);
root.append(galleryBtn, imageContainer);

function renderImages(data) {
  if (imageContainer.innerHTML !== "") {
    imageContainer.innerHTML = "";
  } else {
    for (let i = 0; i < data.length; i++) {
      let img = document.createElement("img");
      img.src = data[i].imageUrl;
      console.log(data[i].imageUrl);
      imageContainer.append(img);
    }
  }
}
// const renderChat = () => {
// socket.connect();

// document.body.innerHTML = "";

// room
let userName = "";
let joinedRoom = "";

let roomandChatContainer = document.createElement("div");
roomandChatContainer.classList.add("roomAndChatContainer");

let roomBox = document.createElement("div");
roomBox.classList.add("roomBox");
saveBtn;


//chatt
let chatContainer = allChatElements(roomBox, roomandChatContainer);

// chatten (lower div)
let chatInputBox = document.createElement("div");
chatInputBox.classList.add("chatInputBox");

let chatInput = document.createElement("input");
chatInput.classList.add("chatInput");

// button + text
let sendBtn = document.createElement("button");
sendBtn.classList.add("sendBtn");
let sendBtnText = document.createElement("h3");
sendBtnText.innerHTML = "skicka";

sendBtn.addEventListener("click", () => {
  
  let message = sendBtnFunction();
  socket.emit("message", message, nickname);
});

sendBtn.append(sendBtnText);
chatInputBox.append(chatInput, sendBtn);

document.body.append(roomandChatContainer);
chatContainer.append(chatInputBox);
// skickar meddelande till surven
socket.on("message", (message, sender, senderId, userColor) => {

  let chatBox1 = document.getElementsByClassName("chatBox")[0];
  let chatMessage = userColorStyle(senderId, socket.id, userColor, sender, message);

  chatBox1.append(chatMessage);
  chatBox1.scrollTo(0, chatBox1.scrollHeight);
});

document.getElementById("chatt").append(roomandChatContainer);
