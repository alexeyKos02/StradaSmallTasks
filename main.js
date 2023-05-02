let textPlace = document.getElementById("text")
textPlace.addEventListener('input', changeText)
let delButton = document.getElementById("delButton")
textPlace.value = localStorage.getItem("text")
delButton.addEventListener('click',deleteAllText)
function changeText(e){
    localStorage.setItem("text", e.currentTarget.value);
}
function deleteAllText(){
    let text= document.getElementById("text")
    text.value = ""
    localStorage.setItem("text", "")
}