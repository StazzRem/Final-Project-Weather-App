// Date
let today = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let day = days[today.getDay()];

let date = today.getDate();
let month = months[today.getMonth()];

let hour = today.getHours();
let minute = today.getMinutes();

let todaysDate = document.querySelector("h2");
todaysDate.innerHTML = `${day}, ${date} ${month} - ${hour}:${String(
  minute
).padStart(2, `0`)}`;

// Location intergration

// DO NOT DELETE \\
let apiKey = "fc951b70b430c59535c6efec00d491ee";
// DO NOT DELETE \\

function usePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(useData);

  document.getElementById(
    "main-container"
  ).style.backgroundImage = `url(./images/sun-clouds.png)`;
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(usePosition);
}

let myLocationButton = document.querySelector("#local-button");
myLocationButton.addEventListener("click", getPosition);

function useData(response) {
  // console.log(response.data);
  resetUnit();
  let city = document.querySelector("h1");
  city.innerHTML = response.data.name;

  let warmth = "";
  if (response.data.main.temp <= 0) {
    warmth = "freezing";
  } else if (response.data.main.temp > 0 && response.data.main.temp <= 10) {
    warmth = "cold";
  } else if (response.data.main.temp > 10 && response.data.main.temp <= 15) {
    warmth = "cool";
  } else if (response.data.main.temp > 15 && response.data.main.temp <= 25) {
    warmth = "warm";
  } else {
    warmth = "hot";
  }

  let clouds = response.data.weather[0].description;

  let description = document.querySelector("#weather-desc");
  description.innerHTML = `Today's weather is ${warmth} with ${clouds}`;

  let weatherIcon = document.querySelector("#weather-icon");
  if (response.data.clouds.all === 0) {
    weatherIcon.innerHTML = `<img src="images/sun-1.png" width="180px">`;
  } else if (response.data.clouds.all < 70) {
    weatherIcon.innerHTML = `<img src="images/sun-cloud.png" width="200px">`;
  } else {
    weatherIcon.innerHTML = `<img src="images/cloud.png" width="200px">`;
  }

  let temp = document.querySelector(".temp-number");
  temp.innerHTML = Math.round(response.data.main.temp);

  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let humid = document.querySelector("#humid-percent");
  humid.innerHTML = Math.round(response.data.main.humidity);
}

function convertTemp() {
  let tempUnit = document.querySelector(".temp-unit");
  let tempNumber = document.querySelector(".temp-number");
  let degreeLabel = document.querySelector(".form-check-label");
  if (tempUnit.innerHTML === "°C") {
    tempNumber.innerHTML = Math.round((tempNumber.innerHTML * 9) / 5 + 32);
    tempUnit.innerHTML = "°F";
    degreeLabel.innerHTML = "°C";
  } else {
    tempNumber.innerHTML = Math.round(((tempNumber.innerHTML - 32) * 5) / 9);
    tempUnit.innerHTML = "°C";
    degreeLabel.innerHTML = "°F";
  }
}

let tempSwitch = document.querySelector("#flexSwitchCheckDefault");
tempSwitch.addEventListener("click", convertTemp);

function getCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#city-search");
  let cityApi = `https://api.openweathermap.org/data/2.5/weather?q=${newCity.value}&appid=${apiKey}&units=metric`;
  axios.get(`${cityApi}`).then(useData);
  newCity.value = "";
  document.getElementById(
    "main-container"
  ).style.backgroundImage = `url(./images/sun-clouds.png)`;
}

let citySearch = document.querySelector("#search-bar");
citySearch.addEventListener("submit", getCity);

function defaultCity(city) {
  let defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${defaultUrl}`).then(useData);
}

defaultCity("Amsterdam");

function useNavBar(event, cityName, imgUrl) {
  event.preventDefault();

  let cityApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(`${cityApi}`).then(useData);
  document.getElementById(
    "main-container"
  ).style.backgroundImage = `url(${imgUrl})`;
}

document
  .querySelector("#ams-link")
  .addEventListener("click", (event) =>
    useNavBar(event, "Amsterdam", "images/Amsterdam.png")
  );

document
  .querySelector("#ldn-link")
  .addEventListener("click", (event) =>
    useNavBar(event, "London", "images/London-1.png")
  );

document
  .querySelector("#tky-link")
  .addEventListener("click", (event) =>
    useNavBar(event, "Tokyo", "images/Tokyo-1.png")
  );

document
  .querySelector("#syd-link")
  .addEventListener("click", (event) =>
    useNavBar(event, "Sydney", "images/Sydney.png")
  );

document
  .querySelector("#nyk-link")
  .addEventListener("click", (event) =>
    useNavBar(event, "New York", "images/New-York.png")
  );

function resetUnit() {
  document.querySelector("#flexSwitchCheckDefault").checked = false;
  let tempUnit = document.querySelector(".temp-unit");
  let degreeLabel = document.querySelector(".form-check-label");
  tempUnit.innerHTML = "°C";
  degreeLabel.innerHTML = "°F";
}
