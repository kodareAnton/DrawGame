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


/* Sparar bilden */

let saveBtn = document.createElement("button");
let saveBtnText = "Spara bilden";

saveBtn.append(saveBtnText)
document.body.append(saveBtn);


saveBtn.addEventListener("click", async (e) => {
    // Konverterar bilden till en sträng
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    // link.click();
    // link.delete;
    let imgToSave = {imageUrl: link.href};
    console.log(imgToSave)

    let response = await fetch('http://localhost:4000/images', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(imgToSave)
    })

    console.log(response);
    
})

/* Galleriet */

let galleryBtn = document.createElement("button");
let galleryBtnText = "Visa galleri";

let imageContainer = document.createElement("div");
imageContainer.classList.add("imageContainer");


galleryBtn.addEventListener("click", async () => {

  try {
      let response = await fetch("http://localhost:4000/images")
      console.log(response)
      let data = await response.json()
        
      renderImages(data);
    } catch (error) {
      console.log(error)
    }
    
    
})

galleryBtn.append(galleryBtnText)
document.body.append(galleryBtn, imageContainer);

function renderImages(data) {
  for (let i=0; i<data.length; i++) {
    
    let img = document.createElement("img");
    img.src = data[i].imageUrl
    console.log(data[i].imageUrl)
    imageContainer.append(img)
  }
  
}