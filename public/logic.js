import {
  getSquare,
  getColor,
  drawGrid,
  fillSquare,
} from "./modules/canvas.mjs";
import {
  allChatElements,
  sendBtnFunction,
  userColorStyle,
} from "./modules/chat.mjs";
import {
  leaveGame,
  outputUsers,
  startGameOnUser,
  startGame,
} from "./modules/login.js";

import { finishedPlaying } from "./modules/compareImg.mjs";
// import pixelmatch from "./../app.js";
let socket = io();

socket.on("connect", () => {
  console.log(socket.id + " A user joined");
});
// let pixelmatch = pixelmatch;
// finishedPlaying(socket.id);

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
  function testFunktion() {
    var image1 = new Image();
    image1.id = "pic1";
    image1.src =
      "data:image/png;base64,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";
    var facitImg = new Image();
    facitImg.id = "pic2";
    facitImg.src =
      "data:image/png;base64,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";
    root.append(image1, facitImg);
    function convertImageToCanvas(imageID) {
      var image = document.getElementById(imageID);
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);
      // image.style = "width: 400px";
      return canvas;
    }

    // function writeResultToPage(imgDataOutput)
    // {
    //     console.log("writeResultToPage was called. imgDataOutput.data.length =", imgDataOutput.data.length);
    //     var canvas = document.createElement("canvas"); //  new HTMLCanvasElement();
    //     var ctx = canvas.getContext("2d");
    //     ctx.putImageData(imgDataOutput, 0, 0);
    //     var result = document.getElementById("result");
    //     result.appendChild(ctx.canvas);
    // }

    // function printNumberPixels(pixels)
    // {
    //     let div = document.createElement('div');
    //     div.className = "alert";
    //     div.innerHTML = "<strong>Differing pixels: </strong>" + pixels;
    //     document.body.append(div);
    // }

    function compareImages() {
      console.clear();
      var cnvBefore = convertImageToCanvas("pic1");
      var cnvAfter = convertImageToCanvas("pic2");

      var ctxBefore = cnvBefore.getContext("2d");
      var ctxAfter = cnvAfter.getContext("2d");

      let imgDataBefore = ctxBefore.getImageData(
        0,
        0,
        cnvBefore.width,
        cnvBefore.height
      );
      let imgDataAfter = ctxAfter.getImageData(
        0,
        0,
        cnvAfter.width,
        cnvAfter.height
      );

      const hght = imgDataBefore.height;
      const wdth = imgDataBefore.width;

      var imgDataOutput = new ImageData(wdth, hght);

      var numDiffPixels = pixelmatch(
        imgDataBefore.data,
        imgDataAfter.data,
        imgDataOutput.data,
        wdth,
        hght,
        { threshold: 0.1 }
      );
      console.log("numDiffPixels =", numDiffPixels);
      printNumberPixels(numDiffPixels);

      // this line does not work
      writeResultToPage(imgDataOutput);
    }
    compareImages();
    // document.querySelector('button.js-compareImages').addEventListener('click', compareImages);

    // socket.emit("finishedImages", image.src, facitImg.src);
  }
  testFunktion();
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

let finishedBtn = document.createElement("button");
finishedBtn.className = "finishedBtn";
finishedBtn.innerText = "Målat klart";

let saveBtnText = "Spara bilden";
document.getElementById("btnContainer").append(saveBtn, finishedBtn);
saveBtn.append(saveBtnText);

//Spara bild
saveBtn.addEventListener("click", async (e) => {
  // Konverterar bilden till en sträng
  const link = document.createElement("a");
  link.download = "download.png";
  link.href = canvas.toDataURL();
  // link.click();
  // link.delete;

  //TODO ändra till HEROKU adress sedan.
  let imgToSave = { imageUrl: link.href };
  console.log(imgToSave);
  console.log(canvas.toDataURL);
  let response = await fetch("http://localhost:3000/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgToSave),
  });

  console.log(response);
});

finishedBtn.addEventListener("click", () => {
  finishedBtn.disabled = true;
  socket.emit("finishedUser", socket.id);
  socket.on("finishedUser", (finishedArray) => {
    if (finishedArray.length === 4) {
      console.log("YES");
      var image = new Image();
      image.id = "pic1";
      image.src =
        "data:image/png;base64,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";
      var facitImg = new Image();
      facitImg.id = "pic2";
      facitImg.src =
        "data:image/png;base64,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";

      socket.emit("finishedImages", image);
    }
  });
});

/* Galleriet */

let galleryBtn = document.createElement("button");
let galleryBtnText = "Visa galleri";

let imageContainer = document.createElement("div");
imageContainer.classList.add("imageContainer");

//TODO ändra till HEROKU adress sedan.
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
  console.log(data);
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

// room

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
  let chatMessage = userColorStyle(
    senderId,
    socket.id,
    userColor,
    sender,
    message
  );

  chatBox1.append(chatMessage);
  chatBox1.scrollTo(0, chatBox1.scrollHeight);
});

document.getElementById("chatt").append(roomandChatContainer);
