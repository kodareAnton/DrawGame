export function finishedMessage() {
  let container = document.getElementById("btnContainer");
  let finishedMessageText = document.createElement("p");
  document.getElementById("titelForTime").style.display = "none";
  document.getElementById("counterForGame").style.display = "none";
  finishedMessageText.innerText = "Bra jobbat! Snart kommer resultatet!";
  container.append(finishedMessageText);
}
