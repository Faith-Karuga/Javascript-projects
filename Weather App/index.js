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
    console.log('Forecast days available:', data.forecast.forecastday.length);
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

let forecastData = []; // Store forecast data globally

function displayForecast(data) {
  forecastData = data.forecast.forecastday; // Store forecast data
  const forecastDays = forecastData;
  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0];
  
  let forecastHTML = "<h3>7-Day Forecast</h3><div class='forecast-grid'>";
  
  forecastDays.forEach((day, index) => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const maxTemp = day.day.maxtemp_c;
    const minTemp = day.day.mintemp_c;
    const icon = day.day.condition.icon;
    const description = day.day.condition.text;
    const isToday = day.date === todayDateStr;
    
    forecastHTML += `
      <div class="forecast-day ${isToday ? 'today' : ''}" data-date="${day.date}" style="cursor: pointer;">
        <p><strong>${dayName}</strong></p>
        <img src="https:${icon}" alt="Weather icon" />
        <p>${description}</p>
        <p><span class="temp-max">${maxTemp}°C</span> / <span class="temp-min">${minTemp}°C</span></p>
        ${isToday ? '<p class="today-badge">Today</p>' : ''}
      </div>
    `;
  });
  
  forecastHTML += "</div>";
  forecastResult.innerHTML = forecastHTML;
  
  // Display hourly predictions for today
  displayTodayHourly(forecastDays);
  
  // Add click event listeners to forecast days
  document.querySelectorAll('.forecast-day').forEach(day => {
    day.addEventListener('click', function() {
      const selectedDate = this.getAttribute('data-date');
      displaySelectedDayHourly(selectedDate);
    });
  });
}

function displayTodayHourly(forecastDays) {
  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0];
  const todayData = forecastDays.find(day => day.date === todayDateStr);
  
  if (!todayData) return;
  
  displayDayPredictions(todayData, "Today's Forecast");
}

function displaySelectedDayHourly(selectedDate) {
  const selectedDay = forecastData.find(day => day.date === selectedDate);
  
  if (!selectedDay) return;
  
  const date = new Date(selectedDay.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  displayDayPredictions(selectedDay, `${dayName}'s Forecast`);
}

function displayDayPredictions(dayData, title) {
  const hours = dayData.hour;
  
  // Extract morning (6am-12pm), afternoon (12pm-6pm), and evening (6pm-12am) predictions
  const morningHours = hours.filter(h => {
    const hour = parseInt(h.time.split(' ')[1].split(':')[0]);
    return hour >= 6 && hour < 12;
  });
  
  const afternoonHours = hours.filter(h => {
    const hour = parseInt(h.time.split(' ')[1].split(':')[0]);
    return hour >= 12 && hour < 18;
  });
  
  const eveningHours = hours.filter(h => {
    const hour = parseInt(h.time.split(' ')[1].split(':')[0]);
    return hour >= 18 || hour < 6;
  });
  
  let hourlyHTML = `<div class='hourly-section'><h3>${title}</h3><div class='hourly-grid'>`;
  
  // Morning
  if (morningHours.length > 0) {
    const morningPrediction = morningHours[0];
    const icon = morningPrediction.condition.icon;
    const condition = morningPrediction.condition.text;
    hourlyHTML += `
      <div class="hourly-item">
        <p class="time">Morning</p>
        <img src="https:${icon}" alt="Weather icon" />
        <p class="condition">${condition}</p>
      </div>
    `;
  }
  
  // Afternoon
  if (afternoonHours.length > 0) {
    const afternoonPrediction = afternoonHours[0];
    const icon = afternoonPrediction.condition.icon;
    const condition = afternoonPrediction.condition.text;
    hourlyHTML += `
      <div class="hourly-item">
        <p class="time">Afternoon</p>
        <img src="https:${icon}" alt="Weather icon" />
        <p class="condition">${condition}</p>
      </div>
    `;
  }
  
  // Evening
  if (eveningHours.length > 0) {
    const eveningPrediction = eveningHours[0];
    const icon = eveningPrediction.condition.icon;
    const condition = eveningPrediction.condition.text;
    hourlyHTML += `
      <div class="hourly-item">
        <p class="time">Evening</p>
        <img src="https:${icon}" alt="Weather icon" />
        <p class="condition">${condition}</p>
      </div>
    `;
  }
  
  hourlyHTML += "</div></div>";
  
  // Update only the hourly section, not the forecast days
  let hourlySection = document.querySelector('.hourly-section');
  if (hourlySection) {
    hourlySection.outerHTML = hourlyHTML;
  } else {
    forecastResult.innerHTML += hourlyHTML;
  }
}
