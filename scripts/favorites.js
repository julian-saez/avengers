const favoritesContainer = document.getElementById("container-cards-characters")
let favoritesCharacters = []

const createCardsFavorites = (name, source, id) => {
    let figure = document.createElement("figure")
    let figcaption = document.createElement("figcaption")
    let img = document.createElement("img")
    let btnRemove = document.createElement("button")
    let columnInfo = document.createElement("div")

    favoritesContainer.appendChild(figure)
    figure.appendChild(img)
    figure.appendChild(columnInfo)
    columnInfo.appendChild(figcaption)
    columnInfo.appendChild(btnRemove)
    figcaption.innerHTML = name
    img.src = source
    img.alt = "Imagen del personaje"
    figure.classList = "flex-container"
    btnRemove.innerHTML = "Quitar"
    columnInfo.classList = "flex-container"
    favoritesContainer.classList = "scale-in-hor-right"

    btnRemove.addEventListener("click", e => {
        e.preventDefault()
        let indexed = favoritesCharacters.reduce((acc, el) => ({
            ...acc, 
            [el.id]: el
        }), {})
        favoritesCharacters.splice(favoritesCharacters.indexOf(indexed[id]), 1)
        saveFavoritesAtLocalStorage(favoritesCharacters)
    })
}

const saveFavoritesAtLocalStorage = () => {
    localStorage.setItem("favoritesCharacters", JSON.stringify(favoritesCharacters))
}

const getFavoritesCharacters = () => {
    let data = JSON.parse(localStorage.getItem("favoritesCharacters"))
    data.forEach(element => {
        favoritesCharacters.push(element)
        createCardsFavorites(element.name, element.avatar, element.id)
    })
}

getFavoritesCharacters()





