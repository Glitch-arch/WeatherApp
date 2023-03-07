// console.log('hey neo');

// const { doesNotMatch } = require("assert");
// const { userInfo } = require("os");
// const { emitKeypressEvents } = require("readline");

// // const datas = fetch('https://api.openweathermap.org/data/2.5/weather?q=goa&appid=a2bf5fba9b3f24e0def2b0e101a6000e')
// // let varr = datas.json;

// // console.log(varr)


// async function showWeather(){

//     try {
        
//     // let city = 'goa';
//     // let key = 'a2bf5fba9b3f24e0def2b0e101a6000e'
   
//     const fetching = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=goa&appid=a2bf5fba9b3f24e0def2b0e101a6000e`);
   
//     let response = await fetching.json();
//     console.log(response);

//     let newpara = document.createElement('p');
//     newpara.textContent = `${response ?.main?.temp.toFixed(2)} c`

//     document.body.appendChild(newpara);
        
//     } catch (error) {
//         console.log(error);
//     }
// }

// // const fetching =  fetch(`https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}`);
// showWeather();

const userContainer = document.querySelector('.user-info-container');
const searchContainer = document.querySelector('.form-container');
const loactionContainer = document.querySelector('.grant-location-container');
const loadingContainer = document.querySelector('.loading-container');
const weatherContainer = document.querySelector('.weatherContainer');

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

//  Initial variables needed 

let currentTab = userTab;
currentTab.classList.add("btn-effect"); 

const APIkey = "d1845658f92b31c64bd94f06f7188c9c";
// const api_link = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API_key}"

getfromSessionStorage();

currentTab.classList.add('current-tab');

// Function to dynamically update data in dom

function renderWeatherInfo(weatherInfo){

    // Fetching elements

    const cityName = document.querySelector("[data-city-name]");
    const countryFlag = document.querySelector("[data-city-flag]");
    const desc = document.querySelector('[data-weather-info]');
    const weatherIcon = document.querySelector('[data-weather-icon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-wind-speed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloud = document.querySelector('[data-clouds]');

    // Fetch values from data object (came from response of fetch api) Used Json formatter to find needed data

    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloud.innerText = `${weatherInfo?.clouds?.all}%`;




}    

// Function to fetch Weather info
async function fetchUserWeatherInfo(coordinates){

    const {lat, lon} = coordinates;

    loactionContainer.classList.remove('active');
    // Make loader visible until fetching is dn
    loadingContainer.classList.add('active');

    // API CALL
    try {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
        const data = await response.json();
   
        // removing loader
        loadingContainer.classList.remove('active');
        userContainer.classList.add('active');
        renderWeatherInfo(data);


    } catch (error) {
        console.log('Got an error while fetching ');
    }
}


// Function for getting coordinates from local storage if there r any!
function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates") // user-coordinates is user-defined name, the one which u save coord. in
    if (!localCoordinates) {
        
        loactionContainer.classList.add('active');

    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

// Function for SWITCHING  tabs
function switchTab(clickedTab){

    if (currentTab != clickedTab) {
        currentTab.classList.remove("btn-effect");
        currentTab = clickedTab;
        currentTab.classList.add("btn-effect");

            // Switching form userTab to searchTab
        if (!searchContainer.classList.contains('active')) {
            
            loactionContainer.classList.remove('active');
            userContainer.classList.remove('active');
            searchContainer.classList.add('active');
        }
        else{
            // Switching to userTab from Search Tab
            userContainer.classList.remove('active');
            searchContainer.classList.remove('active');
            
            // Need userInfo , for that we need its geoloaction i,e coordinates , so we need a function
            // Coordinates saved in the session
            getfromSessionStorage();
        }
    }


}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})

function showPosition(position){

    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    // Saving in session storage
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getlocation(){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('Cannot access your location')
    }

}


const grantAcessBtn = document.querySelector('[data-grant-access]');

grantAcessBtn.addEventListener('click',getlocation);

// for search tab input and api

const searchInput = document.querySelector("[data-searchInput]");
const searchBtn = document.querySelector('.searchBtn');

searchBtn.addEventListener("click",(e)=>{

    e.preventDefault();
  

    if (searchInput.value === "") {
        
    }
    else{
        fetchSearchWeatherInfo(searchInput.value);
    }
})

async function fetchSearchWeatherInfo(cityName){

    loadingContainer.classList.add('active');
    userContainer.classList.remove('active');
    loactionContainer.classList.remove('active');

    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=metric`);
        const data = await response.json();

        loadingContainer.classList.remove('active');
        userContainer.classList.add('active');
        renderWeatherInfo(data);

    } catch (error) {
        console.log('got an err need help')
    }
}