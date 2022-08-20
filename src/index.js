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

let apiKey = "fc951b70b430c59535c6efec00d491ee";

function usePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(lat);
  console.log(lon);

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(getData);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(usePosition);
}

let myLocationButton = document.querySelector("#local-button");
myLocationButton.addEventListener("click", getPosition);

function getData(response) {
  console.log(response.data); // This shows the data for the city searched
  let city = document.querySelector("h1");
  city.innerHTML = response.data.name;
}
