import {Storage} from "./WorkWithLocalStorage.js"

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
let cityName = 'boston';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
let url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
const tabsBtn = document.querySelectorAll(".tabs__nav-btn")
const allTabsContent = document.querySelectorAll(".tabs__block")
let img = document.querySelector('img[alt="like"]')
let storage = new Storage()
const addedLocation = storage.Cities === null ? [] : JSON.parse(storage.Cities)
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
            cityDom.innerHTML = infoCity.name
            secondPageCity.innerHTML = infoCity.name
            document.getElementById("temperatureSecond").innerHTML = "Temperature: " + temperature.toString().substring(0, 2)
            document.getElementById("feelTemp").innerHTML = "Feels like: " + (infoCity.main.feels_like - 273.15).toString().substring(0, 2)
            document.getElementById("cloud").innerHTML = "Weather: " + infoCity.weather[0].main.toString()
        }).catch(function (exception) {
            alert("ошибка")
        })
    }).catch(function (exception) {
        alert("ошибка")
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
            `<li style="display:flex; justify-content: space-between; padding-right: 10px" class="data" id="li${city}"><div class="dataButton" id="${city}">${city}</div style="width: 100%"><div id="${city}exit">&#215;</div></li>`)
        let currentLocation = document.getElementById(city)
        currentLocation.addEventListener("click", function (e) {
            let city = e.currentTarget.textContent
            void getInfoCity(city)
        })
        let exitButton = document.getElementById(`${city}exit`)
        exitButton.addEventListener('click', e => deleteLocation(city))
    })
}