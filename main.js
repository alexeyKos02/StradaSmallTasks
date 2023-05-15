import {Storage} from "./WorkWithLocalStorage.js"

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const futureUrl = 'http://api.openweathermap.org/data/2.5/forecast';
let cityName = 'boston';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
let url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
let futureWeatherUrl = `${futureUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
const tabsBtn = document.querySelectorAll(".tabs__nav-btn")
const allTabsContent = document.querySelectorAll(".tabs__block")
let img = document.querySelector('img[alt="like"]')
let storage = new Storage()
const addedLocation = storage.Cities === null ? [] : JSON.parse(storage.Cities)

document.addEventListener("DOMContentLoaded", ()=>{
    img.addEventListener("click", function () {
        let city = document.getElementById("nameCity").textContent
        addLocation(city)
    })
    tabsBtn.forEach(function (element) {
        element.addEventListener("click", e => changeActiveTab(element))
    })
    document.querySelector(".tabs__nav-btn").click()

    let inputCity = document.getElementById("search")
    inputCity.addEventListener('submit', function (e) {
        e.preventDefault()
        console.log("fsfsd")
        void getInfoCity(e.currentTarget[0].value)
    }, false)
    if (storage.City !== null) {
        inputCity.children[0].value = storage.City
        void getInfoCity(storage.City)
    }
    render()
})

function changeActiveTab(element) {
    let currentElem = element
    if (currentElem.classList.contains('active')) {
        return
    }
    let currentId = element.getAttribute("data-tab")
    let currentTab = document.querySelector(currentId)
    tabsBtn.forEach(function (elem) {
        elem.classList.remove('active')
    })
    allTabsContent.forEach(function (elem) {
        elem.classList.remove('active')
    })
    currentElem.classList.add('active')
    currentTab.classList.add('active')
}

async function getInfoCity(city) {
    storage.setCity(city)
    cityName = city
    url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
    fetch(url).then(response => {
        response.json().then(infoCity => {
            let temperature = infoCity.main.temp - 273.15
            let tempDom = document.getElementById('temperature')
            tempDom.innerHTML = temperature.toString().substring(0, 2)
            let cityDom = document.getElementById("nameCity")
            let secondPageCity = document.getElementById("secCity")
            let thirdCity = document.getElementById("thirdCity")
            cityDom.innerHTML = infoCity.name
            secondPageCity.innerHTML = infoCity.name
            thirdCity.textContent = infoCity.name
            document.getElementById("mainImg").setAttribute("src", `https://openweathermap.org/img/wn/${infoCity.weather[0].icon}@2x.png`)
            document.getElementById("temperatureSecond").innerHTML = "Temperature: " + temperature.toString().substring(0, 2)
            document.getElementById("feelTemp").innerHTML = "Feels like: " + (infoCity.main.feels_like - 273.15).toString().substring(0, 2)
            document.getElementById("cloud").innerHTML = "Weather: " + infoCity.weather[0].main.toString()
            getFutureWeather()
        }).catch(function (exception) {
            alert("ошибка")
        })
    }).catch(function (exception) {
        alert("ошибка")
    })
}

function getFutureWeather() {
    futureWeatherUrl = `${futureUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    fetch(futureWeatherUrl).then(futureWeather => {
        futureWeather.json().then(info => {
            let allTime = info.list.splice(0, 3)
            for (let i = 0; i < allTime.length; i++) {
                let date = new Date(allTime[i].dt_txt)
                document.getElementById("time" + (i + 1)).textContent = date.getHours() + ":00"
                document.getElementById("date" + (i + 1)).textContent = date.getDate().toString() + ", " +
                    new Intl.DateTimeFormat("ru-RU", {month: "long"}).format(date)
                document.getElementById("temp" + (i + 1)).textContent = "Temperature: " + Math.round(allTime[i].main.temp)
                document.getElementById("feel" + (i + 1)).textContent = "Feels like: " + Math.round(allTime[i].main.feels_like)
                document.getElementById("add" + (i + 1)).textContent = allTime[i].weather[0].main
                document.getElementById("img" + (i + 1)).setAttribute("src", `https://openweathermap.org/img/wn/${allTime[i].weather[0].icon}@2x.png`)
            }
        })
    })
}

function addLocation(city) {
    if (!addedLocation.includes(city)) {
        addedLocation.push(city)
        storage.setCities(JSON.stringify(addedLocation))
        render()
    }
}

function deleteLocation(city) {
    if (addedLocation.includes(city)) {
        addedLocation.splice(addedLocation.indexOf(city), 1)
        storage.setCities(JSON.stringify(addedLocation))
        render()
    }
}

function render() {
    let secondBlock = document.getElementById("addedLocation")
    secondBlock.textContent = ''
    addedLocation.forEach(city => {
        secondBlock.insertAdjacentHTML("beforeEnd",
            `<li style="display:flex; justify-content: space-between; padding-right: 10px" class="data" id="li${city}"><div class="dataButton" id="${city}">${city}</div style="width: 100%"><div  class="exit" id="${city}exit">&#215;</div></li>`)
        let currentLocation = document.getElementById(city)
        currentLocation.addEventListener("click", function (e) {
            let city = e.currentTarget.textContent
            void getInfoCity(city)
        })
        let exitButton = document.getElementById(`${city}exit`)
        exitButton.addEventListener('click', e => deleteLocation(city))
    })
}