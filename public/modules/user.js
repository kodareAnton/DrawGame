//Användare ansluter till rum och får sin färg
function userJoin(users, id, username, room) {
  if (users.length <= 3) {
    playRoom = room;
  } else if (users.length > 3 && users.length <= 7) {
    playRoom = room + "1";
  } else if (users.length >= 7) {
    playRoom = room + "2";
  }

  if (users.length === 0 || users.length === 4 || users.length === 8) {
    //blue
    userColor = "#0000FF";
  } else if (users.length === 1 || users.length === 5 || users.length === 9) {
    //green
    userColor = "#008000";
  } else if (users.length === 2 || users.length === 6 || users.length === 10) {
    //yellow
    userColor = "#FFFF00";
  } else if (users.length === 3 || users.length === 7 || users.length === 11) {
    //red
    userColor = "#FF0000";
  }
  const user = { id, username, playRoom, userColor };

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
