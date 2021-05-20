const searchElement = document.querySelector("#formulario input")
const btnSearch = document.getElementById("btnSearch")
const resultsContainer = document.getElementById("results-container")
const apikey = '4d67d9b046ef7a410630968647c8c3b1'
const apiKeyHash = '9031491d74ced7315a4461102ad79545'
const urlCharacters = 'https://gateway.marvel.com:443/v1/public/characters?'
const btnShowAll = document.getElementById("btnShowAll")
const titleCardsSection = document.getElementById("title-cards-section")
const barPaginationContainer = document.getElementById("bar-pagination")
const cardsContainer = document.getElementById("cards-container")
const barPaginationItems = document.getElementById("bar-pagination-items")
const btnBack = document.getElementById("btnBack")
const btnNext = document.getElementById("btnNext")

let charactersResults = new Array()
let favoritesCharactes = []
let allCharacters = new Array()
let character = {
    name: '',
    description: '',
    comics: '',
    series: '',
    seriesCollection: '',
    avatar: ''
}
let offset = 0;

const getFavorites = () => {
    let data = JSON.parse(localStorage.getItem("favoritesCharacters"))
    if(data != null){
        data.forEach(element => {
            favoritesCharactes.push(element)
        })
    }
}

// getFavorites()

const searchAllCharacters = () => {
    fetch(`${urlCharacters}&ts=1&apikey=${apikey}&hash=${apiKeyHash}&limit=6&offset=${offset}`)
        .then(res => res.json())
        .then(res => {
            charactersResults = []
            dataCount = res.data.limit
            let character2 = { ...character }
            res.data.results.forEach(element => {
                character2 = {
                name: element.name,
                comics: element.comics,
                description: element.description,
                series: element.series.available,
                seriesCollection: element.series.collectionURI,
                avatar: `${element.thumbnail.path}.jpg`
            }
            charactersResults.push(character2)
            });
            createCardsCharacters()
        })
        .catch(err => console.log(err))
}
// searchAllCharacters()

const searchCharacterId = name => {
    fetch(`${urlCharacters}&ts=1&apikey=${apikey}&hash=${apiKeyHash}&name=${name}`)
        .then(res => res.json())
        .then(res => {
            charactersResults = []
            let character2 = { ...character }
            character2 = {
                name: res.data.results[0].name,
                comics: res.data.results[0].comics,
                description: res.data.results[0].description,
                series: res.data.results[0].series.available,
                seriesCollection: res.data.results[0].series.collectionURI,
                avatar: `${res.data.results[0].thumbnail.path}.jpg`
            }
            charactersResults.push(character2)
            console.log("funcando por el momento")
            createCardsCharacters()
        })
        .catch(err => console.log(err))
}

let limitElementsToRender;
let i = 0;

const cardsRenderization = (name, source) => {
    let container = document.getElementById("container-cards-characters")
    let figure = document.createElement("figure")
    let figcaption = document.createElement("figcaption")
    let img = document.createElement("img")
    let btnAdd = document.createElement("button")
    let columnInfo = document.createElement("div")

    container.appendChild(figure)
    figure.appendChild(img)
    figure.appendChild(columnInfo)
    columnInfo.appendChild(figcaption)
    columnInfo.appendChild(btnAdd)
    figcaption.innerHTML = name
    img.src = source
    img.alt = "Imagen del personaje"
    figure.classList = "flex-container"
    btnAdd.innerHTML = "Añadir"
    columnInfo.classList = "flex-container"
    container.classList = "scale-in-hor-right"

    btnAdd.addEventListener("click", e => {
        e.preventDefault()
        let characterSelected = charactersResults.filter(element => element.name === name)
        let character2 = {
            name: characterSelected[0].name,
            comics: characterSelected[0].comics,
            description: characterSelected[0].description,
            series: characterSelected[0].series.available,
            seriesCollection: characterSelected[0].series.collectionURI,
            avatar: `${characterSelected[0].avatar}`
        }

        console.log(character2.avatar)

        favoritesCharactes.push(character2)
        saveFavoritesAtLocalStorage(favoritesCharactes)
    })

    figcaption.addEventListener("click", ()  => {
        let characterSelected = charactersResults.filter(element => element.name === name)
        saveSelectedCharacter(characterSelected)
        window.location.href = "/pages/character.html"
    })
}

const deleteCardsCharacters = () => {
    let containerCardsCharacters = document.getElementById("container-cards-characters")
    if(containerCardsCharacters != null){
        resultsContainer.removeChild(containerCardsCharacters)
    }
}

let pagination = 1;

const createBarPagination = () => {
    let div = document.createElement("div")
    let span = document.createElement("span")
    barPaginationItems.appendChild(div)
    div.appendChild(span)
    div.classList = "pagination-item"
    span.innerHTML = pagination
    pagination += 1
}


const createCardsCharacters = async () => {
    titleCardsSection.innerHTML = "Resultados"
    cardsContainer.classList = "cards-container"
    barPaginationContainer.classList = "flex-container"
    let container = document.createElement("div")
    container.id = "container-cards-characters"
    resultsContainer.appendChild(container)

    if(charactersResults.length === 1){
        limitElementsToRender = 1
        cardsRenderization(charactersResults[0].name, charactersResults[0].avatar)
    }else if(charactersResults.length > 1){
        limitElementsToRender = 5
        i= 0;
        for(i; i <= limitElementsToRender; ++i){
            cardsRenderization(charactersResults[i].name, charactersResults[i].avatar)
        }
    }
}

const saveFavoritesAtLocalStorage = data => {
    localStorage.setItem("favoritesCharacters", JSON.stringify(data))
}

const saveSelectedCharacter = data => {
    localStorage.setItem("characterSelected", JSON.stringify(data))
}

btnSearch.addEventListener("click", e => {
    e.preventDefault()
    deleteCardsCharacters()
    searchCharacterId(searchElement.value)
})

/**
 * Show all of the characters list
 */

btnShowAll.addEventListener("click", async e => {
    e.preventDefault()
    deleteCardsCharacters()
    searchAllCharacters()
    createBarPagination()
})

btnNext.addEventListener("click", e => {
    e.preventDefault()
    offset += 5
    deleteCardsCharacters()
    searchAllCharacters()
    createBarPagination()
})

btnBack.addEventListener("click", e => {
    e.preventDefault()
    offset -= 5
    deleteCardsCharacters()
    searchAllCharacters()
})



