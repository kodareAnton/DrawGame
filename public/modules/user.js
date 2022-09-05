//Användare ansluter till rum och får sin färg
function userJoin(users, id, username, playRoom, numberForColor) {
  console.log("FÄRGNUMMER" + numberForColor);

  if (numberForColor === 0) {
    //blue
    userColor = "#0000FF";
  } else if (numberForColor === 1) {
    //green
    userColor = "#008000";
  } else if (numberForColor === 2) {
    //yellow
    userColor = "#FFFF00";
  } else if (numberForColor === 3) {
    //red
    userColor = "#FF0000";
  }
  const user = { id, username, playRoom, userColor, playRoom };

  return user;
}

//Användare lämnar rum

function userLeave(usersArray, id) {
  const index = usersArray.findIndex((user) => user.id === id);

  if (index !== -1) {
    return usersArray.splice(index, 1)[0];
  }
}

//Alla användare kvar i aktuell session
function getRoomUsers(usersArray, playRoom) {
  return usersArray.filter((user) => user.playRoom === playRoom);
}

//Totalt antal användare sen sessionens början
function getRoomAllUsers(users, playRoom) {
  return users.filter((user) => user.playRoom === playRoom);
}

module.exports = {
  userJoin,
  userLeave,
  getRoomUsers,
  getRoomAllUsers,
};
