let map;
let marker;
let currentPosition;
let puzzlePieces = [];

window.onload = () => {
  initMap();
  requestNotification();
};

function initMap() {
  map = L.map('map').setView([52.237, 21.017], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);
}

function getLocation() {
  if (!navigator.geolocation) {
    alert("Brak geolokalizacji");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    currentPosition = position.coords;

    document.getElementById("latitude").innerText = currentPosition.latitude;
    document.getElementById("longitude").innerText = currentPosition.longitude;

    map.setView([currentPosition.latitude, currentPosition.longitude], 15);

    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker([currentPosition.latitude, currentPosition.longitude])
      .addTo(map)
      .bindPopup("Twoja lokalizacja")
      .openPopup();

  }, (error) => {
    console.error(error);
  });
}

function getMap() {
  html2canvas(document.getElementById("map")).then(canvas => {
    const img = canvas.toDataURL("image/png");
    createPuzzle(img);
  });
}

function createPuzzle(imageSrc) {
  const container = document.getElementById("puzzle-container");
  container.innerHTML = "";
  puzzlePieces = [];

  const size = 4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {

      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.draggable = true;

      piece.style.backgroundImage = `url(${imageSrc})`;
      piece.style.backgroundSize = "400px 400px";
      piece.style.backgroundPosition = `${-x * 100}px ${-y * 100}px`;

      piece.dataset.correctX = x;
      piece.dataset.correctY = y;

      addDragEvents(piece);

      puzzlePieces.push(piece);
    }
  }

  shuffle(puzzlePieces);

  puzzlePieces.forEach(p => container.appendChild(p));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let dragged;

function addDragEvents(element) {
  element.addEventListener("dragstart", () => {
    dragged = element;
  });

  element.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  element.addEventListener("drop", function () {
    if (dragged === this) return;

    let parent = this.parentNode;

    parent.insertBefore(dragged, this);
    parent.insertBefore(this, dragged);

    checkWin();
  });
}

function checkWin() {
  const pieces = document.querySelectorAll(".puzzle-piece");

  let correct = true;

  pieces.forEach((piece, index) => {
    const x = index % 4;
    const y = Math.floor(index / 4);

    if (piece.dataset.correctX != x || piece.dataset.correctY != y) {
      correct = false;
    }
  });

  if (correct) {
    showNotification();
  }
}

function requestNotification() {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("Gratulacje!", {
      body: "Ułożyłeś puzzle!"
    });
  }
}
