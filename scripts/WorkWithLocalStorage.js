export class Storage {
    setCities(cities) {
        localStorage.setItem("cities", cities)
    }

    setCity(city) {
        localStorage.setItem("city", city)
    }

    get City() {
        return localStorage.getItem("city")
    }

    get Cities() {
        return localStorage.getItem("cities")
    }
}
