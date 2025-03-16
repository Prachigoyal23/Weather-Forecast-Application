const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const dropdownMenu = document.querySelector(".dropdown-menu"); // For the dropdown menu
const API_KEY = "9c2407e95d39d4e8af483a8a78635762"; // API key for openWeatherMap API

// Function to create the weather cards
const createWeatherCard = (cityName, weatherItem, index) => {
    // Get the weather condition for background changes and icons
    const weatherCondition = weatherItem.weather[0].main.toLowerCase();
    let weatherIcon = '';
    let backgroundStyle = '';

    // Map weather conditions to appropriate icons and background colors
    if (weatherCondition === 'clear') {
        weatherIcon = 'https://openweathermap.org/img/wn/01d@2x.png'; // Sun icon
        backgroundStyle = 'background: linear-gradient(to right, #FFB74D, #FF9800)';
        document.body.style.backgroundImage = "url('https://media.istockphoto.com/id/1007768414/photo/blue-sky-with-bright-sun-and-clouds.jpg?s=612x612&w=0&k=20&c=MGd2-v42lNF7Ie6TtsYoKnohdCfOPFSPQt5XOz4uOy4=')"
    } else if (weatherCondition === 'clouds') {
        weatherIcon = 'https://openweathermap.org/img/wn/02d@2x.png'; // Cloud icon
        backgroundStyle = 'background: linear-gradient(to right, #B0BEC5, #607D8B)';
        document.body.style.backgroundImage = "url('https://www.rochesterfirst.com/wp-content/uploads/sites/66/2021/04/sky-1107579_1920.jpg')"
    } else if (weatherCondition === 'rain') {
        weatherIcon = 'https://openweathermap.org/img/wn/10d@2x.png'; // Raindrop icon
        backgroundStyle = 'background: linear-gradient(to right, #64B5F6, #2196F3)';
        document.body.style.backgroundImage = "url('https://i.pinimg.com/736x/7f/53/0f/7f530f6e2583aa24c733232140dbbd55.jpg')"
    } else if (weatherCondition === 'snow') {
        weatherIcon = 'https://openweathermap.org/img/wn/13d@2x.png'; // Snowflake icon
        backgroundStyle = 'background: linear-gradient(to right, #E1F5FE, #B3E5FC)';
        document.body.style.backgroundImage = "url('https://www.vmcdn.ca/f/files/via/images/weather/vancouver-weather-forecast-december-2021-snowfall.jpg')"
    } else if (weatherCondition === 'thunderstorm') {
        weatherIcon = 'https://openweathermap.org/img/wn/11d@2x.png'; // Thunderstorm icon
        backgroundStyle = 'background: linear-gradient(to right, #37474F, #263238)';
        document.body.style.backgroundImage = "url('https://static.independent.co.uk/2021/06/16/15/newFile-5.jpg')"
    } else if (weatherCondition === 'drizzle') {
        weatherIcon = 'https://openweathermap.org/img/wn/09d@2x.png'; // Drizzle icon (Light rain)
        backgroundStyle = 'background: linear-gradient(to right, #81C784, #388E3C)';
        document.body.style.backgroundImage = "url('https://static.tnn.in/thumb/msid-102788395,thumbsize-26808,width-1280,height-720,resizemode-75/102788395.jpg')"
    } else if (weatherCondition === 'fog') {
        weatherIcon = 'https://openweathermap.org/img/wn/50d@2x.png'; // Fog icon
        backgroundStyle = 'background: linear-gradient(to right, #9E9E9E, #757575)';
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2016/11/22/19/10/clouds-1850093_640.jpg')"
    } else {
        weatherIcon = 'https://openweathermap.org/img/wn/01d@2x.png'; // Default clear weather icon
        backgroundStyle = 'background: linear-gradient(to right, #81C784, #388E3C)';
        document.body.style.backgroundImage = "url('https://static.vecteezy.com/system/resources/previews/013/235/847/large_2x/clear-sky-slightly-cloudy-clear-weather-suitable-for-activities-background-props-photo.jpg')"
    }

    // Get the fixed time (5 minutes or 1 hour ago) for all forecast entries
    const currentTime = new Date();
    const fixedTime = new Date(currentTime.getTime());


    const fixedTimeString = fixedTime.toISOString().split('T')[1].split('.')[0]; // Extract HH:MM:SS
   

    if (index === 0) {
        // Main weather card
        return `<div class="details" style="${backgroundStyle}">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Time: ${fixedTimeString}</h4> <!-- Use fixed time -->
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="${weatherIcon}" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        // Forecast weather cards
        return ` <li class="card" style="${backgroundStyle}">
                     <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                     <h4>Time: ${fixedTimeString}</h4> <!-- Use fixed time -->
                     <img src="${weatherIcon}" alt="weather-icon">
                     <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                     <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                     <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}

// Function to get weather details for a city
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // Filter the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing Previous Weather Data
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });

        // Save the city to local storage (to show in dropdown)
        saveRecentlySearchedCity(cityName);
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}


// Function to get coordinates of the city
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user entered city name and remove extra spaces
    if (!cityName) return; // Return if city name is empty
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates (name, latitude, longitude) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

// Function to get coordinates based on current location
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            // Get City Name from coordinates using reverse geolocation API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city!");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            }
        }
    );
}

// Function to save recently searched city in local storage
const saveRecentlySearchedCity = (cityName) => {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

    // Avoid duplicates in the list
    if (!recentCities.includes(cityName)) {
        recentCities.push(cityName);
    }

    // Save the updated list to local storage
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    updateDropdownMenu();
}

// Function to update the dropdown menu with recently searched cities
const updateDropdownMenu = () => {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

    // Clear the dropdown menu before adding new options
    dropdownMenu.innerHTML = '';

    // Add recent cities to the dropdown menu
    recentCities.forEach(city => {
        const cityOption = document.createElement('option');
        cityOption.value = city;
        cityOption.textContent = city;
        dropdownMenu.appendChild(cityOption);
    });

    // Show dropdown menu if there are recent cities
    if (recentCities.length > 0) {
        dropdownMenu.style.display = 'block';
    } else {
        dropdownMenu.style.display = 'none';
    }
}

// Function to handle dropdown city selection
const handleDropdownSelection = (e) => {
    const selectedCity = e.target.value;
    if (selectedCity) {
        getCityCoordinatesFromDropdown(selectedCity);
    }
}

// Function to get weather details using a city from the dropdown
const getCityCoordinatesFromDropdown = (cityName) => {
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}


// Event listeners
searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);
dropdownMenu.addEventListener("change", handleDropdownSelection);
cityInput.addEventListener("focus", updateDropdownMenu); // Show dropdown on input focus
