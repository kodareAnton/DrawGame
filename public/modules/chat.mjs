
// skickar chatt meddelande
export function sendBtnFunction(){
    let message = document.getElementsByClassName("chatInput")[0].value;
    console.log(message);

    return message;
}

// skapar och sätter färg på meddelande 
export function userColorStyle(senderId, socketId, userColor, sender, message){

    let chatMessage = document.createElement("div");
    chatMessage.classList.add("chatMessage");
    chatMessage.id = 'chatMessage';
    chatMessage.innerText = sender + " : " + message;

    if (senderId === socketId) {
        chatMessage.style.justifyContent = "flex-end";
      }
    
      if (userColor === "#008000") {
        chatMessage.style.backgroundColor = "rgba(0, 128, 0, 0.608)";
      } else if (userColor === "#0000ff") {
        chatMessage.style.backgroundColor = "rgba(44, 126, 173, 0.553";
      } else if (userColor === "#ffff00") {
        chatMessage.style.backgroundColor = "rgba(188, 190, 23, 0.575)";
      } else if (userColor === "#ff0000") {
        chatMessage.style.backgroundColor = "rgba(190, 23, 23, 0.575)";
      }

      console.log(senderId, socketId, userColor);

      return chatMessage;
}


export function allChatElements(roomBox, roomandChatContainer){

    let chatContainer = document.createElement("div");
    chatContainer.classList.add("chatContainer");

    let joinedRoomHeader = document.createElement("h1");
    joinedRoomHeader.classList.add("joinedRoomHeader");

    // meddelandet som skickas av en client
    let chatBox = document.createElement("div");
    chatBox.classList.add("chatBox");

    chatContainer.append(joinedRoomHeader, chatBox);
    roomandChatContainer.append(roomBox, chatContainer);

    return chatContainer;
}