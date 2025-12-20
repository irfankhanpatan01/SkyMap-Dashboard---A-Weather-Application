const API_KEY = "25264983150c5ae492808398dd919ab6";

/* ---------- DOM ---------- */
const input = document.querySelector("#input-search");
const searchBtn = document.querySelector("#searchBtn");

const city = document.querySelector("#city");
const temp = document.querySelector("#temp");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind-speed");
const condition = document.querySelector("#weather-condition");

const hourlyBox = document.querySelector("#hourly");
const dailyBox = document.querySelector("#daily");

const errorBox = document.querySelector("#error-message");

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

function clearError() {
  errorBox.textContent = "";
  errorBox.style.display = "none";
}
async function fetchCityWeather(cityName) {
  clearError();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    updateUI(data);
    updateMap(data.coord.lat, data.coord.lon);
    fetchForecast(data.coord.lat, data.coord.lon);

  } catch (error) {
    showError("❌ City not found. Please enter a correct city name.");
  }
}


/* ---------- DATE ---------- */
function updateTime() {
  document.querySelector("#date-time").textContent =
    new Date().toLocaleString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
}
updateTime();
setInterval(updateTime, 60000);

/* ---------- MAP ---------- */
let map, marker;
function updateMap(lat, lon) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    map.setView([lat, lon], 14);
    marker.setLatLng([lat, lon]);
  }
}

/* ---------- UI ---------- */
function updateUI(data) {
  city.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = `${Math.round(data.main.temp - 273.15)}°C`;
  feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like - 273.15)}°C`;
  humidity.textContent = `Humidity ${data.main.humidity}%`;
  wind.textContent = `Wind ${data.wind.speed} m/s`;
  condition.textContent = data.weather[0].main;
}

/* ---------- WEATHER ---------- */
async function fetchWeather(url) {
  const res = await fetch(url);
  const data = await res.json();
  updateUI(data);
  updateMap(data.coord.lat, data.coord.lon);
  fetchForecast(data.coord.lat, data.coord.lon);
}

searchBtn.onclick = () => {
  if (!input.value) return;
  fetchWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${API_KEY}`
  );
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && input.value) searchBtn.click();
});

/* ---------- LOCATION ---------- */
navigator.geolocation?.getCurrentPosition(pos => {
  fetchWeather(
    `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${API_KEY}`
  );
});

/* ---------- FORECAST ---------- */
async function fetchForecast(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  const data = await res.json();

  renderHourly(data.list);
  renderDaily(data.list);
}

function renderHourly(list) {
  hourlyBox.innerHTML = "";
  list.slice(0, 8).forEach(i => {
    hourlyBox.innerHTML += `
      <div class="hour">
        <p>${new Date(i.dt * 1000).getHours()}:00</p>
        <p>${Math.round(i.main.temp - 273.15)}°C</p>
      </div>
    `;
  });
}

function renderDaily(list) {
  dailyBox.innerHTML = "";
  const days = {};
  list.forEach(i => {
    const d = new Date(i.dt * 1000).toDateString();
    const t = i.main.temp - 273.15;
    days[d] ??= { min: t, max: t };
    days[d].min = Math.min(days[d].min, t);
    days[d].max = Math.max(days[d].max, t);
  });

  Object.entries(days).slice(0, 5).forEach(([d, t]) => {
    dailyBox.innerHTML += `
      <div class="day">
        <p>${d}</p>
        <p>${Math.round(t.max)}° / ${Math.round(t.min)}°</p>
      </div>
    `;
  });
}

searchBtn.onclick = () => {
  const value = input.value.trim();

  if (!value) {
    showError("⚠️ Please enter a city name.");
    return;
  }

  fetchCityWeather(value);
};
