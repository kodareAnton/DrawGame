 // Funktion för att identifiera vilken ruta spelaren klickar på
 export function getSquare(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: 1 + (evt.clientX - rect.left) - (evt.clientX - rect.left)%20,
        y: 1 + (evt.clientY - rect.top) - (evt.clientY - rect.top)%20
    };
  }

  //Funktion för att identifiera vilken färg rutan har
  export function getColor(contex,x,y) {
    var p = contex.getImageData(x,y,19,19).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    return(hex)
  }

  //Funktion för att omvandla identiferad färg till hexkod
  export function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  //Funktion för att rita upp rutnätet på spelytan. Varje ruta är 20px
  export function drawGrid(context) {
      for (var x = 0.5; x < 301; x += 20) {
        context.moveTo(x, 0);
        context.lineTo(x, 300);
      }
      
      for (var y = 0.5; y < 301; y += 20) {
        context.moveTo(0, y);
        context.lineTo(300, y);
      }
      
      context.strokeStyle = "#ddd";
      context.stroke();
  }

  //Funktion för att fylla i rutan med en färg
  export function fillSquare(context, x, y, color){
      //Kontrollerar om rutan är i spelarens färg och färgar/avfärgar utifrån detta
      console.log(color);
      
      if (color === "#3864ab"){
        context.fillStyle = "#ffffff"
        context.fillRect(x,y,19,19);
      }
      else if(color === "#000000"|| "#ffffff" ){
        context.fillStyle = "#3864ab"
        context.fillRect(x,y,19,19);
      }
      else(
        console.log("Du kan inte färglägga över andra spelares färg")
      )
      
  }

 

//   drawGrid(context);

//   //Eventlyssnaren som kör funktionerna vid musklick
//   canvas.addEventListener('click', function(evt) {
//       //Hämtar positionen för klickad ruta
//       var mousePos = getSquare(canvas, evt);

//       //Hämtar färgen för klickad ruta
//       var color = getColor(context, mousePos.x, mousePos.y)

//       //Färglägger klickad ruta
//       fillSquare(context, mousePos.x, mousePos.y, color)
//   }, false);
