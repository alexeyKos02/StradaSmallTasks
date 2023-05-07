let firstName = "Artem"
const serverUrl = 'https://api.genderize.io'
let url = `${serverUrl}?name=${firstName}`

let input = document.getElementById("firstName")
input.addEventListener('input',changeName)
let button = document.getElementById("button")
button.addEventListener('click',getSex)
function changeName(e){
    firstName =  e.currentTarget.value;
}

async function getSex(){
    url = `${serverUrl}?name=${firstName}`
    let response = await fetch(url)
    let obj = await response.json()
    let sex = obj.gender
    alert(`${firstName} is a ${sex}`)
}

