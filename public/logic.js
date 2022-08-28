import { post } from "../app.js";
import { getSquare, getColor, drawGrid, fillSquare } from "./modules/canvas.mjs"

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

let saveBtn = document.createElement("button")
document.body.append(saveBtn)




  


saveBtn.addEventListener("click", async () => {
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    console.log("img link: " + link.href)
    // link.click();
    // link.delete;
    //postImage(link.href);
    let test = {imgUrl: "kanske så?"}
    postImage(test);
    console.log("sist i eventlistener")
})

async function postImage (image) {
    try {
        await fetch('http://localhost:4000/images', {
            Method: 'POST',
            Headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json'
            },
            Body: JSON.stringify(image),
            Cache: 'default'
          })
    
    } catch (error) {
        console.log(error);
    } 

  }

 

