import {Storage} from "./WorkWithLocalStorage.js"
import {hidePreloader, showPreloader} from "./Preloader.js";
import {addTabs} from "./Tabs.js";
import {getFutureForecast, getWeather} from "./Api.js";

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const futureUrl = 'http://api.openweathermap.org/data/2.5/forecast';
let cityName = 'boston';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
let img = document.querySelector('img[alt="like"]')
let storage = new Storage()
const addedLocation = storage.Cities === null ? [] : JSON.parse(storage.Cities)

document.addEventListener("DOMContentLoaded", () => {
    img.addEventListener("click", function () {
        let city = document.getElementById("nameCity").textContent
        addLocation(city)
    })
    addTabs()
    let inputCity = document.getElementById("search")
    inputCity.addEventListener('submit', function (e) {
        e.preventDefault()
        void renderInfoCity(e.currentTarget[0].value)
    }, false)
    if (storage.City !== null) {
        inputCity.children[0].value = storage.City
        void renderInfoCity(storage.City)
    } else {
        inputCity.children[0].value = cityName
        void renderInfoCity(cityName)
    }
    renderRightSide()
})


async function renderInfoCity(city) {
    storage.setCity(city)
    cityName = city
    getWeather(serverUrl, cityName, apiKey).then(infoCity => {
        showPreloader()
        renderLeftSideData(infoCity)
        hidePreloader()
    }).catch(function (exception) {
        alert(exception.value)
    })
}

function renderLeftSideData(infoCity) {
    let {name, main: {temp, feels_like}, weather} = infoCity
    let temperature = Math.round(temp)
    let tempDom = document.getElementById('temperature')
    tempDom.innerHTML = temperature

    let cityDom = document.getElementById("nameCity")
    cityDom.innerHTML = name

    let secondPageCity = document.getElementById("secCity")
    secondPageCity.innerHTML = name

    let thirdCity = document.getElementById("thirdCity")
    thirdCity.textContent = name
    document.getElementById("mainImg").setAttribute("src", `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`)
    document.getElementById("temperatureSecond").innerHTML = "Temperature: " + temperature
    document.getElementById("feelTemp").innerHTML = "Feels like: " + (Math.round(feels_like))
    document.getElementById("cloud").innerHTML = "Weather: " + weather[0].main.toString()
    renderFutureWeather()
}

function renderFutureWeather() {
    getFutureForecast(futureUrl, cityName, apiKey).then(info => {
        let allTime = info.list.splice(0, 3)
        for (let i = 0; i < allTime.length; i++) {
            let date = new Date(allTime[i].dt_txt)
            document.getElementById("time" + (i + 1)).textContent = date.getHours() + ":00"
            document.getElementById("date" + (i + 1)).textContent = date.getDate().toString() + ", " + new Intl.DateTimeFormat("ru-RU", {month: "long"}).format(date)
            document.getElementById("temp" + (i + 1)).textContent = "Temperature: " + Math.round(allTime[i].main.temp)
            document.getElementById("feel" + (i + 1)).textContent = "Feels like: " + Math.round(allTime[i].main.feels_like)
            document.getElementById("add" + (i + 1)).textContent = allTime[i].weather[0].main
            document.getElementById("img" + (i + 1)).setAttribute("src", `https://openweathermap.org/img/wn/${allTime[i].weather[0].icon}@2x.png`)
        }
    })
}

function addLocation(city) {
    if (!addedLocation.includes(city)) {
        addedLocation.push(city)
        storage.setCities(JSON.stringify(addedLocation))
        renderRightSide()
    }
}

function deleteLocation(city) {
    if (addedLocation.includes(city)) {
        addedLocation.splice(addedLocation.indexOf(city), 1)
        storage.setCities(JSON.stringify(addedLocation))
        renderRightSide()
    }
}

function renderRightSide() {
    let secondBlock = document.getElementById("addedLocation")
    secondBlock.textContent = ''
    addedLocation.forEach(city => {
        secondBlock.insertAdjacentHTML("beforeEnd",
            `<li style="display:flex; justify-content: space-between; padding-right: 10px" class="data" id="li${city}">
                    <div class="dataButton" id="${city}">${city}</div>
                    <div class="exit" id="${city}exit">&#215;</div>
                  </li>`)
        let currentLocation = document.getElementById(city)
        currentLocation.addEventListener("click", function (e) {
            let city = e.currentTarget.textContent
            void renderInfoCity(city)
        })
        let exitButton = document.getElementById(`${city}exit`)
        exitButton.addEventListener('click', e => deleteLocation(city))
    })
}