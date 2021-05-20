const favoritesContainer = document.getElementById("container-cards-characters")
let favoritesCharacters = []

const createCardsFavorites = (name, source) => {
    let figure = document.createElement("figure")
    let figcaption = document.createElement("figcaption")
    let img = document.createElement("img")
    let btnAdd = document.createElement("button")
    let columnInfo = document.createElement("div")

    favoritesContainer.appendChild(figure)
    figure.appendChild(img)
    figure.appendChild(columnInfo)
    columnInfo.appendChild(figcaption)
    columnInfo.appendChild(btnAdd)
    figcaption.innerHTML = name
    img.src = source
    img.alt = "Imagen del personaje"
    figure.classList = "flex-container"
    btnAdd.innerHTML = "Quitar"
    columnInfo.classList = "flex-container"
    favoritesContainer.classList = "scale-in-hor-right"

    btnAdd.addEventListener("click", e => {
        e.preventDefault()
        let characterSelected = charactersResults.filter(element => element.name === name)
        saveFavoritesAtLocalStorage(characterSelected)
    })
}

const getFavoritesCharacters = () => {
    let data = JSON.parse(localStorage.getItem("favoritesCharacters"))
    data.forEach(element => {
        favoritesCharacters.push(element)
    })
    for(let i = 0; i <= favoritesCharacters.length; ++i){
        createCardsFavorites(favoritesCharacters[i].name, favoritesCharacters[i].avatar)
    }
}

getFavoritesCharacters()





