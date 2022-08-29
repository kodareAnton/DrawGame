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

let username;
buttonGoToRoom.addEventListener("click", startGame);

function startGame() {
  let room = "Room";
  username = inputUser.value;
  if (username.length === 0) {
    return (inputUser.placeholder = "Måste vara ifyllt");
  }
  root.style.display ="none";
  document.getElementById("myCanvas").style.display ="block"
  saveBtn.append(saveBtnText)
  document.body.append(saveBtn);

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
  for (let i=0; i<data.length; i++) {
    
    let img = document.createElement("img");
    img.src = data[i].imageUrl
    console.log(data[i].imageUrl)
    imageContainer.append(img)
  }
  
}