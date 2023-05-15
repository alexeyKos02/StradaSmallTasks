export async function getFutureForecast(futureUrl, cityName, apiKey) {
    let futureWeatherUrl = `${futureUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    let response = await fetch(futureWeatherUrl)
    if (!response.ok) {
        throw new Error("ошибка")
    }
    return response.json()
}

export async function getWeather(serverUrl, cityName, apiKey) {
    let url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    let response = await fetch(url)
    if (!response.ok) {
        throw new Error("ошибка")
    }
    return response.json()
}