// import { finishedTimer } from "./finished.mjs";

// let socket = io();

//startfunktion som skickar rum och användarnamn till socket i.o
//Om lyckat så försvinner login och chat + spelyta visas.
export function startGame(username) {
  if (username.length === 0) {
    document.getElementById("inputUser").placeholder = "Måste vara ifyllt";
    return "validationFail";
  }
  document.getElementById("root").style.display = "none";
  document.getElementById("containerPage").style.display = "flex";
  document.getElementById("header").style.display = "flex";
}

//Skapar lista med användare
export function outputUsers(users) {
  let userList = document.getElementById("userList");
  userList.classList = "userList";
  userList.innerHTML = "";
  users.forEach((user) => {
    let userInRoom = document.createElement("li");
    userInRoom.innerText = user.username;
    userInRoom.classList = "userInRoom";
    userInRoom.style.color = "white";
    userInRoom.style.border = "5px solid" + user.userColor;
    userInRoom.style.boxShadow = "0px 0px 5px 5px" + user.userColor;
    // if (user.userColor === "#008000") {
    //   document.getElementById("header").style.backgroundColor =
    //     "rgba(0, 128, 0, 0.608)";
    // } else if (user.userColor === "#0000ff") {
    //   document.getElementById("header").style.backgroundColor =
    //     "rgba(44, 126, 173, 0.553";
    // } else if (user.userColor === "#ffff00") {
    //   document.getElementById("header").style.backgroundColor =
    //     "rgba(188, 190, 23, 0.575)";
    // } else if (user.userColor === "#ff0000") {
    //   document.getElementById("header").style.backgroundColor =
    //     "rgba(190, 23, 23, 0.575)";
    // }

    userList.append(userInRoom);
  });
}

//TODO Loggar ut till startsidan, ska ändras till heroku-adress.
export async function leaveGame() {
  window.location.reload();
}
let titelForTime = document.createElement("p");
titelForTime.id = "titelForTime";
titelForTime.innerText = "Tid kvar:";
let counterForGame = document.createElement("p");
counterForGame.id = "counterForGame";
//Nedräkning till spelet startar

export function startGameOnUser(imageFromSocket, allUsersFromStart, socketID) {
  // return new Promise((resolve, reject) => {
  let userColor;

  for (let i = 0; i < allUsersFromStart.length; i++) {
    if (allUsersFromStart[i].id === socketID) {
      userColor = allUsersFromStart[i].userColor;
      document.getElementById("colorPaint").style.backgroundColor = userColor;
      console.log(userColor);
    }
  }

  document.getElementById("containerWaitBanner").style.display = "flex";

  let waitBanner = document.getElementById("waitBanner");

  let image = new Image();
  image.src = imageFromSocket;

  waitBanner.innerText = "";
  var counter = 5;
  return new Promise((resolve, reject) => {
    setInterval(function () {
      counter--;

      if (counter > 0) {
        waitBanner.innerHTML = counter;
      }

      if (counter === 0) {
        waitBanner.innerText = "NU börjar spelet!";
      }
      if (counter === -2) {
        document.getElementById("colorPaint").style.display = "block";
        document.getElementById("waitHeading").style.display = "inline";
        waitBanner.innerText = "";
        waitBanner.append(image);
        setTimeout(function () {
          document.getElementById("myCanvas").style.display = "block";
          document.getElementById("btnContainer").style.display = "block";
          document.getElementById("containerWaitBanner").style.display = "none";

          clearInterval(counter);
        }, 7000);

        document
          .getElementById("btnContainer")
          .append(titelForTime, counterForGame);
        var counter2 = 37;

        setInterval(function () {
          counter2--;
          if (counter2 < 30) {
            counterForGame.innerHTML = counter2;
          }

          if (counter2 === 0) {
            document.getElementById("titelForTime").style.display = "none";
            document.getElementById("counterForGame").style.display = "none";
            resolve("done");
            // finishedTimer(socketID);
            clearInterval(counter2);
          }
        }, 1000);
        // });
      }
    }, 1000);
  });
}
