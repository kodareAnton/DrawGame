// Pixel regn
export function createPixel() {
  const pixel = document.createElement("div");
  pixel.classList.add("pixel");

  document.getElementById("main").append(pixel);

  pixel.style.left = Math.random() * 100 + "vw";
  pixel.style.animationDuration = Math.random() * 2 + 3 + "5";
  setTimeout(() => {
    pixel.remove();
  }, 4000);
}
