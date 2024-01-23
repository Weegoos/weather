const IMG_WINTER  =  "https://cdn-icons-png.flaticon.com/128/2938/2938076.png"
const IMG_SPRING = "https://cdn-icons-png.flaticon.com/128/6960/6960454.png"
const IMG_SUMMER = "https://cdn-icons-png.flaticon.com/128/3204/3204420.png"
const IMG_AUTUMN = "https://cdn-icons-png.flaticon.com/128/3075/3075987.png"

function loading(){
    let counter = 3;
    document.querySelector('body').setAttribute('style', 'overflow-y: hidden')
    setInterval(() => {
        if (counter > 0){
           
            counter--;
            if (counter == 0){
                document.querySelector('.loading').setAttribute('style', 'display: none')
                document.querySelector('body').setAttribute('style', 'overflow-y: scroll')
            }
        }
    }, 1000);
    
}

loading()

function determinCity(){
    let city = localStorage.getItem('localCity')
    const APIKEY = 'bc1833444dad7c2f74f97cce5b50c72e';
    const APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;
    window.onload = determineWeather(APIURL);

    printTheNameOfTheCity(city)
}

console.log(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=bc1833444dad7c2f74f97cce5b50c72e`);

function printTheNameOfTheCity(cityName){
    let spanForCity = document.querySelector('.showTheNameOfCity')
    spanForCity.innerHTML = `${cityName[0].toUpperCase()}${cityName.slice(1)}`
}

async function determineWeather(api){
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        let localTemperature = ((data.main.temp - 273) < 0) ? Math.round(data.main.temp - 273) : Math.round(data.main.temp - 273)

        showInformationAboutRealTimeWeather(data)
        determineRealWeatherDescription(data)
        const weatherData = `${localTemperature}°C`;
        document.querySelector('.temparature').innerText = weatherData;

        setBodyPhoto(localTemperature)
    } catch (error) {
        console.error('Ошибка при получении погоды:', error);
    }
}

function showInformationAboutRealTimeWeather(dataAboutWeather) {
    let weatherDefinition = document.querySelector('.definition');
    let min_and_maxTemp = document.querySelector('.min_and_maxTemp');
    let feels_like = document.querySelector('.feels_like');
    let humidity = document.querySelector('.humidity');
    let pressure = document.querySelector('.pressure');
    let windSpeedText = document.querySelector('.windSpeedText');
    let countryCodeText = document.querySelector('.countryCodeText');
    let image = document.querySelector('.countryCode');
    let rainVolumeText = document.querySelector('.rainVolumeText');

    console.log(dataAboutWeather);
    // console.log(Math.round(dataAboutWeather.main.humidity));

    weatherDefinition.innerHTML = `${dataAboutWeather.weather[0].main} day`;
    min_and_maxTemp.innerHTML = `Coordinate: ${dataAboutWeather.coord.lon} / ${dataAboutWeather.coord.lat} `;
    feels_like.innerHTML = `Feels like: ${Math.round(dataAboutWeather.main.feels_like - 273)}°`;
    humidity.innerHTML = `${dataAboutWeather.main.humidity}%`;
    pressure.innerHTML = `${dataAboutWeather.main.pressure}hPa`;
    windSpeedText.innerHTML = `${dataAboutWeather.wind.speed} m/s`;
    image.src = "https://cdn-icons-png.flaticon.com/128/9746/9746966.png";
    countryCodeText.innerHTML = `${dataAboutWeather.sys.country}`;
    localStorage.setItem('country', dataAboutWeather.sys.country)
    if (dataAboutWeather.rain && dataAboutWeather.rain["3h"]) {
        let rainVolume = dataAboutWeather.rain["3h"];
        rainVolumeText.innerHTML = `Rain volume (last 3 hours): ${rainVolume} mm`;
    } else {
        // If rain data is not available, hide or clear the rainVolumeText
        rainVolumeText.innerHTML = "";
    }
}

function setBodyPhoto(temp){
    let body_img = document.querySelector('#body_img');
    let season;
   if (temp < 0){
    body_img.src = IMG_WINTER
    season = "winter"
   }else if (temp > 5 && temp < 15){
    body_img.src = IMG_SPRING
    season = "spring"
   }else if (temp > 15){
    body_img.src = IMG_SUMMER
    season = "summer"
   }else {
    body_img.src = IMG_AUTUMN
    season = "autumn"
   }
   setStyleForWeatherSection(season)
}

function setStyleForWeatherSection(determineSeason){
    let header = document.querySelector('.header')
    switch (determineSeason) {
        case "winter":
        //  header.classList.add('winterStyle')
            break;
        case "summer":
            // header.classList.add('summerStyle');
            break;
        default:
            break;
    }
}

determinCity()

// note

function determineRealWeatherDescription(description){
    let notes= document.querySelector('.text')
    const storedCity = localStorage.getItem('localCity');
    // notes.innerHTML = description.weather[0].description
    notes.innerHTML = `Hi, the weather is ${description.weather[0].description} in ${storedCity} today. <span class="extraText">Use the map below to get a better orientation. Our team wishes you a good day!</span>`;

    // console.log(description.weather[0].description);
}


// map
var map = L.map('map').setView([40.7128, -74.0060], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function addCityMarkers(cityNames) {
    const markers = [];

    for (const cityName of cityNames) {
        try {
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=8953b22ed7eb4a3db39a1e8a3e0b917f`);
            const { lat, lng } = response.data.results[0].geometry;

            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(cityName);
            markers.push(marker);
        } catch (error) {
            console.error(`Error geocoding ${cityName}:`, error);
        }
    }

    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds());
}

const storedCity = localStorage.getItem('localCity');
const cityNames = storedCity ? [storedCity] : [];
addCityMarkers(cityNames);

// 62258a344ca5405a8e27ca63ed9decef

const apiKey = 'bc1833444dad7c2f74f97cce5b50c72e';
const city = localStorage.getItem('localCity');
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

async function fetchWeatherData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000);

        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather-card');

        weatherCard.innerHTML = `
            <h2>${date.toDateString()}</h2>
            <p>Max Temperature: ${dayData.main.temp_max}°C</p>
            <p>Min Temperature: ${dayData.main.temp_min}°C</p>
            <p>Wind Direction: ${dayData.wind.deg}°</p>
            <p>Sunrise: ${new Date(dayData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: ${new Date(dayData.sys.sunset * 1000).toLocaleTimeString()}</p>
        `;

        weatherContainer.appendChild(weatherCard);
    }
}

fetchWeatherData();

