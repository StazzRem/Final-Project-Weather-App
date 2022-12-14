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

// creating a variable - contents declared later
let lastResponse;

// Retreiving correct day from forecast data
function formatDate(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let upcomingDay = forecastDate.getDay();
  let upcomingDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return upcomingDays[upcomingDay];
}

// Forecast replication function
function displayForecast(response, unit) {
  let unitLetter = "";
  if (unit === "metric") {
    unitLetter = "C";
  } else {
    unitLetter = "F";
  }

  let forecastArray = response.data.daily;

  let forecastElement = document.querySelector("#next-five-days");

  let forecastHTML = `<div class="row justify-content-center">`;

  forecastArray.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <h5 class="forecast-day">${formatDate(forecastDay.dt)}</h5>
        <img
          src="${forecastIcon(forecastDay.weather[0].main)}"
          alt="forecast-weather-icon"
          id="forecast-w-icon"
        />
        <p class="minmax-text">
          <strong>Low / High</strong> <br />
          <span id="forecast-min-${index}">${Math.round(
          forecastDay.temp.min
        )}</span
          ><span id="forecast-degrees">°${unitLetter}</span> /
          <span id="forecast-max-${index}">${Math.round(
          forecastDay.temp.max
        )}</span
          ><span id="forecast-degrees">°${unitLetter}</span>
        </p>
      </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Applying forecast weather icons
function forecastIcon(forecastDesc) {
  // another way of writing else if
  switch (forecastDesc) {
    case "Clear":
      return "images/sun-1.png";
      break;
    case "Clouds":
      return "images/cloud.png";
      break;
    case "Rain":
      return "images/rain2.png";
      break;
    default:
      console.log(forecastDesc);
      return "images/sun-cloud.png";
      break;
  }
}

// Location intergration

// DO NOT DELETE \\
let apiKey = "fc951b70b430c59535c6efec00d491ee";
// DO NOT DELETE \\

// Using current location
function usePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(useData);

  document.getElementById(
    "main-container"
  ).style.backgroundImage = `url(./images/sun-clouds.png)`;
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(usePosition);
}

let myLocationButton = document.querySelector("#local-button");
myLocationButton.addEventListener("click", getPosition);

// Getting forecast city co-ordinates

function getForecast(coordinates, unit) {
  let forecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${apiKey}&units=${unit}`;
  axios.get(forecastAPI).then((response) => displayForecast(response, unit));
}

// Displaying weather data
function useData(response) {
  resetUnit();

  // declaring the contents of this GLOBAL variable
  lastResponse = response;
  //

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
    if (response.data.weather[0].description.includes("rain")) {
      weatherIcon.innerHTML = `<img src="images/sun-rain.png" width="200px">`;
    } else {
      weatherIcon.innerHTML = `<img src="images/sun-cloud.png" width="200px">`;
    }
  } else {
    if (response.data.weather[0].description === "moderate rain") {
      weatherIcon.innerHTML = `<img src="images/rain2.png" width="200px">`;
    } else if (response.data.weather[0].description === "light rain") {
      weatherIcon.innerHTML = `<img src="images/rain3.png" width="200px">`;
    } else {
      weatherIcon.innerHTML = `<img src="images/cloud.png" width="200px">`;
    }
  }

  let temp = document.querySelector(".temp-number");
  temp.innerHTML = Math.round(response.data.main.temp);

  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let humid = document.querySelector("#humid-percent");
  humid.innerHTML = Math.round(response.data.main.humidity);

  getForecast(response.data.coord, "metric");
}

// Changing C and F
function convertTemp() {
  let tempUnit = document.querySelector(".temp-unit");
  let tempNumber = document.querySelector(".temp-number");
  let degreeLabel = document.querySelector(".form-check-label");

  if (tempUnit.innerHTML === "°C") {
    getForecast(lastResponse.data.coord, "imperial");
    tempNumber.innerHTML = Math.round((tempNumber.innerHTML * 9) / 5 + 32);
    tempUnit.innerHTML = "°F";
    degreeLabel.innerHTML = "°C";
  } else {
    getForecast(lastResponse.data.coord, "metric");
    tempNumber.innerHTML = Math.round(((tempNumber.innerHTML - 32) * 5) / 9);
    tempUnit.innerHTML = "°C";
    degreeLabel.innerHTML = "°F";
  }
}

let tempSwitch = document.querySelector("#flexSwitchCheckDefault");
tempSwitch.addEventListener("click", convertTemp);

// City search including background
function getCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#city-search");
  let cityApi = `https://api.openweathermap.org/data/2.5/weather?q=${newCity.value}&appid=${apiKey}&units=metric`;
  axios.get(cityApi).then(useData);
  newCity.value = "";
  document.getElementById(
    "main-container"
  ).style.backgroundImage = `url(./images/sun-clouds.png)`;
}

let citySearch = document.querySelector("#search-bar");
citySearch.addEventListener("submit", getCity);

// Introducing a default city
function defaultCity(city) {
  let defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(defaultUrl).then(useData);
}

defaultCity("Amsterdam");

// Function attached to the navigation bar including backgrounds
function useNavBar(event, cityName, imgUrl) {
  event.preventDefault();

  let cityApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(cityApi).then(useData);
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
    useNavBar(event, "Tokyo", "images/Tokyo-2.png")
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

// Fixes a bug with converting the temp and changing cities
function resetUnit() {
  document.querySelector("#flexSwitchCheckDefault").checked = false;
  let tempUnit = document.querySelector(".temp-unit");
  let degreeLabel = document.querySelector(".form-check-label");
  tempUnit.innerHTML = "°C";
  degreeLabel.innerHTML = "°F";
}
