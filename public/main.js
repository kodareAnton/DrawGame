const socket = io();
    import {fillSquare, getSquare, getColor, drawGrid} from "/modules/canvas.mjs"

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
        console.log(userArray);
        socket.emit("joinRoom", { username, room });
      
        socket.on("roomUsers", ({ roomname, users }) => {
          userArray = users;
          console.log(userArray);
      
          if (username.length === 0) {
            return (inputUser.placeholder = "Måste vara ifyllt");
          }
        });
      }

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

          var canvasURL = canvas.toDataURL();
          socket.emit("draw", canvasURL);
      }, false);

      socket.on("draw", function(draw){
        var img = new Image();
        img.onload=start;
        img.src = draw;
        function start(){
          context.drawImage(img, 0,0)
        }
      })