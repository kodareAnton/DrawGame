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

  container.append(welcomeHeader, nameInput, nextButton);
  document.body.append(container);
};

const renderChat = () => {
  document.body.innerHTML = "";
  let roomandChatContainer = document.createElement("div");
  roomandChatContainer.classList.add("roomAndChatContainer");

  let roomBox = document.createElement("div");
  roomBox.classList.add("roomBox");

  let chatContainer = document.createElement("div");
  chatContainer.classList.add("chatContainer");

  roomandChatContainer.append(roomBox, chatContainer);

  // chatten
  let chatInputBox = document.createElement("div");
  chatInputBox.classList.add("chatInputBox");

  let chatInput = document.createElement("input");
  chatInput.classList.add("chatInput");

  // button + text
  let sendBtn = document.createElement("button");
  sendBtn.classList.add("sendBtn");
  let sendBtnText = document.createElement("h3");
  sendBtnText.innerHTML = "skicka";

  sendBtn.append(sendBtnText);
  chatInputBox.append(chatInput, sendBtn);

  document.body.append(roomandChatContainer, chatInputBox);
};

window.addEventListener("load", renderNamePage);
