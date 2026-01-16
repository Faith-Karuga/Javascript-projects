const API_KEY = "dd39ff69651b4ec7810160211260301"; 

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const forecastResult = document.getElementById("forecastResult");
const errorMsg = document.getElementById("errorMsg");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
  const city = cityInput.value.trim();

  weatherResult.innerHTML = "";
  forecastResult.innerHTML = "";
  errorMsg.textContent = "";

  if (!city) {
    errorMsg.textContent = "Please enter a city name.";
    return;
  }

  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    displayWeather(data);
    displayForecast(data);
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

function displayForecast(data) {
  const forecastDays = data.forecast.forecastday;
  
  let forecastHTML = "<h3>7-Day Forecast</h3><div class='forecast-grid'>";
  
  forecastDays.forEach(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const maxTemp = day.day.maxtemp_c;
    const minTemp = day.day.mintemp_c;
    const icon = day.day.condition.icon;
    const description = day.day.condition.text;
    
    forecastHTML += `
      <div class="forecast-day">
        <p><strong>${dayName}</strong></p>
        <img src="https:${icon}" alt="Weather icon" />
        <p>${description}</p>
        <p><span class="temp-max">${maxTemp}°C</span> / <span class="temp-min">${minTemp}°C</span></p>
      </div>
    `;
  });
  
  forecastHTML += "</div>";
  forecastResult.innerHTML = forecastHTML;
}
