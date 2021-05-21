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
const form = document.getElementById("formulario")


let charactersResults = new Array()
let favoritesCharacters = new Array()
let allCharacters = new Array()
let favoritesCharactersId = new Array()
let character = {
    name: '',
    description: '',
    comics: '',
    series: '',
    seriesCollection: '',
    avatar: '',
    id: ''
}
let offset = 0;

const getFavorites = () => {
    let data = JSON.parse(localStorage.getItem("favoritesCharacters"))
    if(data != null){
        data.forEach(element => {
            favoritesCharactersId.push(element.id)
            favoritesCharacters.push(element)
        })
    }
}

if(localStorage.key("favoritesCharacters")){
    getFavorites()
}

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
                avatar: `${element.thumbnail.path}.jpg`,
                id: element.id
            }
            charactersResults.push(character2)
            });
            createCardsCharacters()
        })
        .catch(err => console.log(err))
}

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
                avatar: `${res.data.results[0].thumbnail.path}.jpg`,
                id: res.data.results[0].id
            }
            charactersResults.push(character2)
            createCardsCharacters()
        })
        .catch(err => console.log(err))
}

let limitElementsToRender;
let i = 0;



const cardsRenderization = (name, source, id) => {
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
    let btnAddState;
    
    if(favoritesCharactersId.includes(id)){
        btnAdd.innerHTML = "Quitar"
        btnAddState = false
    }else{
        btnAdd.innerHTML = "Añadir"
        btnAddState = true
    }

    columnInfo.classList = "flex-container"
    container.classList = "scale-in-hor-right"
    

    btnAdd.addEventListener("click", e => {
        e.preventDefault()
        if(btnAddState){
            let characterSelected = charactersResults.filter(element => element.name === name)
            favoritesCharacters.push(characterSelected[0])
            saveFavoritesAtLocalStorage(favoritesCharacters)
            btnAdd.innerHTML = "Quitar"
            btnAddState = false
        }else{
            let index = favoritesCharactersId.indexOf(id)
            favoritesCharacters.splice(index, 1)
            saveFavoritesAtLocalStorage(favoritesCharacters)
            btnAdd.innerHTML = "Añadir"
            btnAddState = true
        }

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
        cardsRenderization(charactersResults[0].name, charactersResults[0].avatar, charactersResults[0].id)
    }else if(charactersResults.length > 1){
        limitElementsToRender = 5
        i= 0;
        for(i; i <= limitElementsToRender; ++i){
            cardsRenderization(charactersResults[i].name, charactersResults[i].avatar, charactersResults[i].id)
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
    document.getElementById("formulario").reset()
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
    // Lo que hace este offset es un horror vea por donde lo veas, y repite el request de unos elementos, lo sé. Pero recibirá una mejora hoy xd
    offset -= 5
    deleteCardsCharacters()
    searchAllCharacters()
})



