// Advanced Practice Question 1: Weather Forecast App
// Description: Fetches weather data based on user input and displays weather details.

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-city");
    const searchButton = document.getElementById("search-button");
    const weatherOutput = document.getElementById("weather-output");
    
    // Function to fetch weather data
    async function fetchWeather(city) {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
            if (!res.ok) {
                throw new Error("City not found");
            }
            const data = await res.json();
            displayWeather(data);
        } catch (error) {
            weatherOutput.innerHTML = `<p class='error'>⚠️ ${error.message}</p>`;
        }
    }
    
    // Function to display weather data
    function displayWeather(data) {
        weatherOutput.innerHTML = `
            <h3>Weather in ${data.name}, ${data.sys.country}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Condition: ${data.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
        `;
    }
    
    // Event listener for search button
    searchButton.addEventListener("click", function () {
        const city = searchInput.value.trim();
        if (city) fetchWeather(city);
    });
});

