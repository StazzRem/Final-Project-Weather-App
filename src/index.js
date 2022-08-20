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

let todaysDate = document.querySelector("h2");
todaysDate.innerHTML = `${day}, ${date} ${month}`;

// Location intergration

// DO NOT DELETE \\
let apiKey = "fc951b70b430c59535c6efec00d491ee";
// DO NOT DELETE \\

function usePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(lat);
  console.log(lon);

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(useData);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(usePosition);
}

let myLocationButton = document.querySelector("#local-button");
myLocationButton.addEventListener("click", getPosition);

function useData(response) {
  let city = document.querySelector("h1");
  city.innerHTML = response.data.name;

  let weatherIcon = document.querySelector("#weather-icon");
  if (response.data.clouds.all === 0) {
    weatherIcon.innerHTML = `<img src="images/sun.png" width="120px">`;
  } else if (response.data.clouds.all < 70) {
    weatherIcon.innerHTML = `<img src="images/sun-cloud.png" width="200px">`;
  } else {
    weatherIcon.innerHTML = `<img src="images/cloud.png" width="200px">`;
  }

  let temp = document.querySelector("#current-temp");
  temp.innerHTML = Math.round(response.data.main.temp) + "°C";

  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let humid = document.querySelector("#humid-percent");
  humid.innerHTML = Math.round(response.data.main.humidity);
}

function getCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#city-search");
  let cityApi = `https://api.openweathermap.org/data/2.5/weather?q=${newCity.value}&appid=${apiKey}&units=metric`;
  axios.get(`${cityApi}`).then(useData);
  newCity.value = "";
}

let citySearch = document.querySelector("#search-bar");
citySearch.addEventListener("submit", getCity);

function defaultCity(city) {
  let defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${defaultUrl}`).then(useData);
}

defaultCity("Amsterdam");

function useNavBar(event, cityName) {
  event.preventDefault();
  let cityApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(`${cityApi}`).then(useData);
}

document
  .querySelector("#ams-link")
  .addEventListener("click", (event) => useNavBar(event, "Amsterdam"));

document
  .querySelector("#ldn-link")
  .addEventListener("click", (event) => useNavBar(event, "London"));

document
  .querySelector("#tky-link")
  .addEventListener("click", (event) => useNavBar(event, "Tokyo"));

document
  .querySelector("#syd-link")
  .addEventListener("click", (event) => useNavBar(event, "Sydney"));

document
  .querySelector("#nyk-link")
  .addEventListener("click", (event) => useNavBar(event, "New York"));
