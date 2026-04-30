const weatherBtn = document.getElementById("weatherBtn");

weatherBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;

  if(city === "") {
    alert("Nie podano miasta");
    return;
  }

  gettoday(city);
  getForecast(city);
});

function gettoday(city) {

  const apiKey = "ab1c463d7555fd74f2ea46e9bdaeeb97";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onload = function() {
    if(xhr.status === 200) {

      const data = JSON.parse(xhr.responseText);
      console.log(data);

      document.getElementById("today").innerHTML = `
                <h2>Aktualna pogoda w ${data.name}</h2>
                <p><strong>Temperatura:</strong> ${Math.round(data.main.temp)} °C</p>
                <p><strong>Odczuwalna:</strong> ${Math.round(data.main.feels_like)} °C</p>
                <p><strong>Wilgotność:</strong> ${data.main.humidity}%</p>
                <p><strong>Opis:</strong> ${data.weather[0].description}</p>
            `;

    } else {
      document.getElementById("today").innerHTML = `<p>Nie znaleziono miasta.</p>`;
    }
  };

  xhr.send();
}

function getForecast(city) {

  const apiKey = "ab1c463d7555fd74f2ea46e9bdaeeb97";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      console.log(data);

      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";

      const today = new Date();
      const groupedDays = {};

      data.list.forEach(item => {

        const date = new Date(item.dt_txt);

        if(date.getDate() === today.getDate()) {
          return;
        }

        const day = date.toLocaleDateString("pl-PL");

        if(!groupedDays[day]) {
          groupedDays[day] = [];
        }

        groupedDays[day].push(item);
      });

      Object.keys(groupedDays).forEach(day => {

        const dayBox = document.createElement("div");
        dayBox.classList.add("forecast-day");
        dayBox.innerHTML = `<h2>${day}</h2>`;

        groupedDays[day].forEach(item => {
          const date = new Date(item.dt_txt);
          const time = date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit"
          });

          const card = document.createElement("div");
          card.classList.add("forecast-card");

          card.innerHTML = `
            <p><strong>${time}</strong></p>
            <p>${Math.round(item.main.temp)} °C</p>
            <p>${item.weather[0].description}</p>
        `;

          dayBox.appendChild(card);
        });

        forecastContainer.appendChild(dayBox);
      });
    })

    .catch(error => {
      console.error("Błąd:", error);
    });
}
