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
  if (!currentPosition) {
    alert("Najpierw pobierz lokalizację!");
    return;
  }

  const lat = currentPosition.latitude;
  const lon = currentPosition.longitude;
  
  const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=400x400`;

  createPuzzle(url);
}

function createPuzzle(imageSrc) {
  const piecesContainer = document.getElementById("pieces");
  const board = document.getElementById("board");

  piecesContainer.innerHTML = "";
  board.innerHTML = "";

  const size = 4;
  const pieceSize = 100;

  let pieces = [];

  for (let i = 0; i < size * size; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");

    slot.dataset.index = i;

    slot.addEventListener("dragover", e => e.preventDefault());

    slot.addEventListener("drop", function () {
      if (!dragged) return;

      this.innerHTML = "";
      this.appendChild(dragged);

      checkWin();
    });

    board.appendChild(slot);
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {

      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.draggable = true;

      piece.style.backgroundImage = `url(${imageSrc})`;
      piece.style.backgroundSize = "400px 400px";
      piece.style.backgroundPosition = `${-x * pieceSize}px ${-y * pieceSize}px`;

      piece.dataset.correctIndex = y * size + x;

      piece.addEventListener("dragstart", () => {
        dragged = piece;
      });

      pieces.push(piece);
    }
  }

  shuffle(pieces);

  pieces.forEach(p => piecesContainer.appendChild(p));
}

createPuzzle("https://picsum.photos/400");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let dragged = null;

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
  const slots = document.querySelectorAll("#board .slot");

  let correct = true;

  slots.forEach((slot, index) => {
    const piece = slot.firstChild;

    if (!piece || piece.dataset.correctIndex != index) {
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
