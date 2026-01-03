const API_KEY = "dd39ff69651b4ec7810160211260301"; 

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const errorMsg = document.getElementById("errorMsg");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
  const city = cityInput.value.trim();

  weatherResult.innerHTML = "";
  errorMsg.textContent = "";

  if (!city) {
    errorMsg.textContent = "Please enter a city name.";
    return;
  }

  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    errorMsg.textContent = error.message;
    console.error(error);
  }
}

function displayWeather(data) {
  const temperature = data.current.temp_c;
  const description = data.current.condition.text;
  const icon = data.current.condition.icon;
  const cityName = data.location.name;
  const country = data.location.country;

  weatherResult.innerHTML = `
    <h2>${cityName}, ${country}</h2>
    <img src="https:${icon}" alt="Weather icon" />
    <p><strong>${temperature}°C</strong></p>
    <p>${description}</p>
  `;
}
