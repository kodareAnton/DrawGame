let socket = io({ autoconnect: false });

let userName = "";
let joinedRoom = "";

const renderNamePage = () => {
  let container = document.createElement("div");
  container.classList.add("welcomeBox");

  let welcomeHeader = document.createElement("h2");
  welcomeHeader.innerText = "Välkommen till Drawgame";

  let nameInput = document.createElement("input");
  nameInput.innerText = "Ange ditt username!";
  nameInput.addEventListener("input", e => {
    nickname = e.target.value;
    console.log(nickname);
  });

  let nextButton = document.createElement("button");
  nextButton.classList.add("nextButton");
  nextButton.innerText = "Gå till chatten";
  nextButton.addEventListener("click", renderChat);

  container.append(welcomeHeader, nameInput, nextButton);
  document.body.append(container);
};

//// Som vi ska använda

const renderChat = () => {
  socket.connect();

  document.body.innerHTML = "";

  // room
  let roomandChatContainer = document.createElement("div");
  roomandChatContainer.classList.add("roomAndChatContainer");

  let roomBox = document.createElement("div");
  roomBox.classList.add("roomBox");

  let welcomeHeader = document.createElement("h1");
  welcomeHeader.innerText = nickname;
  welcomeHeader.classList.add("welcomeHeader");

  let inputHeader = document.createElement("h2");
  inputHeader.innerText = "gå med i rum";
  inputHeader.classList.add("inputHeader");

  let roomCreateInput = document.createElement("input");
  roomCreateInput.id = "roomCreateInput";
  roomCreateInput.placeholder = "Namn på rum";

  let roomCreateBtn = document.createElement("button");
  roomCreateBtn.innerText = "Skapa rum / Gå med";
  roomCreateBtn.classList.add("roomCreateBtn");

  // rum som användare kopplas till
  roomCreateBtn.addEventListener("click", () => {
    let roomToJoin = document.getElementById("roomCreateInput").value;
    joinedRoom = roomToJoin;
    document.getElementsByClassName("joinedRoomHeader")[0].innerText =
      joinedRoom;
    socket.emit("join", roomToJoin);
  });

  roomBox.append(welcomeHeader, inputHeader, roomCreateInput, roomCreateBtn);

  let chatContainer = document.createElement("div");
  chatContainer.classList.add("chatContainer");

  let joinedRoomHeader = document.createElement("h1");
  joinedRoomHeader.classList.add("joinedRoomHeader");

  // meddelandet som skickas av en client
  chatBox = document.createElement("div");
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
    socket.emit("message", message, nickname, joinedRoom);
  });

  sendBtn.append(sendBtnText);
  chatInputBox.append(chatInput, sendBtn);

  document.body.append(roomandChatContainer, chatInputBox);
};

// skickar meddelande till surven
socket.on("message", (message, sender, senderId) => {
  console.log(senderId, socket.id);

  let chatBox = document.getElementsByClassName("chatBox")[0];

  let chatMessage = document.createElement("div");
  chatMessage.classList.add("chatMessage");
  chatMessage.innerText = sender + " : " + message;

  chatBox.append(chatMessage);

  if (senderId == socket.id) {
    chatMessage.style.justifyContent = "flex-end";
    chatMessage.style.backgroundColor = "green";
  }

  chatBox.append(chatMessage);
  chatBox.scrollTo(0, chatbox.scrollHeight);
});

window.addEventListener("load", renderNamePage);
