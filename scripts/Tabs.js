const tabsBtn = document.querySelectorAll(".tabs__nav-btn")
const allTabsContent = document.querySelectorAll(".tabs__block")

export function addTabs() {
    tabsBtn.forEach(function (element) {
        element.addEventListener("click", e => changeActiveTab(element))
    })
    document.querySelector(".tabs__nav-btn").click()
}

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
