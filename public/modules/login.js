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
  userList.innerHTML = "";
  users.forEach((user) => {
    let userInRoom = document.createElement("li");
    userInRoom.innerText = user.username;
    userInRoom.classList = "userInRoom";
    userList.append(userInRoom);
  });
}

//TODO Loggar ut till startsidan, ska ändras till heroku-adress.
export function leaveGame() {
  window.location = "http://localhost:3000/index.html";
}

//Nedräkning till spelet startar
export function startGameOnUser(imageFromSocket) {
  let waitBanner = document.getElementById("waitBanner");
  let image = new Image();
  image.src = imageFromSocket;
  // if (users.length === 4) {
  waitBanner.innerText = "";
  var counter = 5;
  setInterval(function () {
    counter--;

    if (counter > 0) {
      waitBanner.innerHTML = counter;
    }

    if (counter === 0) {
      waitBanner.innerText = "NU börjar spelet!";
    }
    if (counter === -2) {
      waitBanner.innerText = "";
      waitBanner.append(image);
      setTimeout(function () {
        document.getElementById("myCanvas").style.display = "block";
        document.getElementById("btnContainer").style.display = "block";
        document.getElementById("waitBanner").style.display = "none";

        clearInterval(counter);
      }, 5000);
    }
  }, 1000);
  // }
}
