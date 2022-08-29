import { getSquare, getColor, drawGrid, fillSquare } from "./modules/canvas.mjs"

let socket = io();



socket.on("connect", () => {
  console.log(socket.id + " A user joined");
});

let root = document.getElementById("root");
let main = document.createElement("main");
main.className = "main";

let containerWelcome = document.createElement("div");
containerWelcome.className = "containerWelcome";
let header = document.createElement("h1");
header.innerText = "Välkommen till PaintGame";
let loginMessage = document.createElement("p");
loginMessage.innerText = "Skriv in användarnamn och börja måla!";

let containerForm = document.createElement("div");
containerForm.classList = "containerForm";


let inputUser = document.createElement("input");
inputUser.type = "text";
inputUser.name = "username";
inputUser.id = "username";
inputUser.placeholder = "Användarnamn";
inputUser.required = true;

let buttonGoToRoom = document.createElement("button");
buttonGoToRoom.innerText = "Starta spel";

let playroomListContainer = document.createElement("formcontainer");

//Appends
root.append(main);
main.append(containerWelcome, containerForm);
containerWelcome.append(header, loginMessage);
containerForm.append(inputUser, playroomListContainer, buttonGoToRoom);

//Addera till rullista

let userArray = [];
let nickname = ""

let username;
buttonGoToRoom.addEventListener("click", startGame);

function startGame() {
  let room = "Room";
  username = inputUser.value;
  nickname = username
  if (username.length === 0) {
    return (inputUser.placeholder = "Måste vara ifyllt");
  }
  root.style.display ="none";
  document.getElementById("myCanvas").style.display ="block"
  document.getElementById("chatt").style.display ="block"
  saveBtn.append(saveBtnText)
  document.getElementById("btnContainer").append(saveBtn);

  socket.emit("joinRoom", { username, room });

  socket.on("roomUsers", ({ roomname, users }) => {
    userArray = users;
    
  });
}


// //CANVAS
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
drawGrid(context);

//Eventlyssnaren som kör funktionerna vid musklick
canvas.addEventListener('click', function(evt) {
    //Hämtar positionen för klickad ruta
    var mousePos = getSquare(canvas, evt);

    //Hämtar färgen för klickad ruta
    var color = getColor(context, mousePos.x, mousePos.y)

    //Färglägger klickad ruta
    fillSquare(context, mousePos.x, mousePos.y, color)
}, false);


/* Sparar bilden */

let saveBtn = document.createElement("button");
let saveBtnText = "Spara bilden";

// saveBtn.append(saveBtnText)
// document.body.append(saveBtn);


saveBtn.addEventListener("click", async (e) => {
    // Konverterar bilden till en sträng
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    // link.click();
    // link.delete;
    let imgToSave = {imageUrl: link.href};
    console.log(imgToSave)

    let response = await fetch('http://localhost:3000/images', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(imgToSave)
    })

    console.log(response);
    
})

/* Galleriet */

let galleryBtn = document.createElement("button");
let galleryBtnText = "Visa galleri";

let imageContainer = document.createElement("div");
imageContainer.classList.add("imageContainer");

galleryBtn.addEventListener("click", async () => {

  try {
      let response = await fetch("http://localhost:3000/images")
      console.log(response)
      let data = await response.json()
      
      renderImages(data);
    } catch (error) {
      console.log(error)
    }
})

galleryBtn.append(galleryBtnText)
root.append(galleryBtn, imageContainer);

function renderImages(data) {
  
  // Tömmer galleriet och fyller på med de senaste bilderna
  imageContainer.innerHTML = "";

  for (let i=0; i<data.length; i++) {
    
    let img = document.createElement("img");
    img.src = data[i].imageUrl
    console.log(data[i].imageUrl)
    imageContainer.append(img)
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
  

    // let welcomeHeader = document.createElement("h1");
    // welcomeHeader.innerText = nickname;
    // welcomeHeader.classList.add("welcomeHeader");
  
    // let inputHeader = document.createElement("h2");
    // inputHeader.innerText = "gå med i rum";
    // inputHeader.classList.add("inputHeader");
  
    // let roomCreateInput = document.createElement("input");
    // roomCreateInput.id = "roomCreateInput";
    // roomCreateInput.placeholder = "Namn på rum";
  
    // let roomCreateBtn = document.createElement("button");
    // roomCreateBtn.innerText = "Skapa rum / Gå med";
    // roomCreateBtn.classList.add("roomCreateBtn");
  
    // rum som användare kopplas till
    // roomCreateBtn.addEventListener("click", () => {
    //   let roomToJoin = document.getElementById("roomCreateInput").value;
    //   joinedRoom = roomToJoin;
    //   document.getElementsByClassName("joinedRoomHeader")[0].innerText =
    //     joinedRoom;
    //   socket.emit("join", roomToJoin);
    // });
  
    // roomBox.append(welcomeHeader, inputHeader, roomCreateInput, roomCreateBtn);
   //chatt
   let chatContainer = document.createElement("div");
   chatContainer.classList.add("chatContainer");
 
   let joinedRoomHeader = document.createElement("h1");
   joinedRoomHeader.classList.add("joinedRoomHeader");
 
   // meddelandet som skickas av en client
  let chatBox = document.createElement("div");
   chatBox.classList.add("chatBox");
 
   chatContainer.append(joinedRoomHeader, chatBox);
 
   roomandChatContainer.append(roomBox, chatContainer);
 
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
     let message = document.getElementsByClassName("chatInput")[0].value;
     console.log(message);
     socket.emit("message", message, nickname);
   });
 
   sendBtn.append(sendBtnText);
   chatInputBox.append(chatInput, sendBtn);
 
   document.body.append(roomandChatContainer);
   chatContainer.append(chatInputBox);
 ;
 
 // skickar meddelande till surven
 socket.on("message", (message, sender, senderId, userColor) => {
   console.log(senderId, socket.id, userColor);
 
   let chatBox1 = document.getElementsByClassName("chatBox")[0];
 
   let chatMessage = document.createElement("div");
   chatMessage.classList.add("chatMessage");
   chatMessage.innerText = sender + " : " + message;
 
   chatBox1.append(chatMessage);
 
   if (senderId == socket.id) {
     chatMessage.style.justifyContent = "flex-end";
   }
   if(userColor === "green"){
    chatMessage.style.backgroundColor = "rgba(0, 128, 0, 0.608)";
   } else if (userColor === "blue"){
    chatMessage.style.backgroundColor = "rgba(44, 126, 173, 0.553"
   }
   else if (userColor === "yellow") {
    chatMessage.style.backgroundColor = "rgba(188, 190, 23, 0.575)"
   }else if(userColor==="red"){
    chatMessage.style.backgroundColor = "rgba(190, 23, 23, 0.575)"
   }
   
 
 
   chatBox1.append(chatMessage);
   chatBox1.scrollTo(0, chatBox1.scrollHeight);
  });
// }
document.getElementById("chatt").append(roomandChatContainer)