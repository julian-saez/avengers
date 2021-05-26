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
let offset = 0;
let countDataResults = 0

let charactersResults = new Array()
let favoritesCharacters = new Array()
let allCharacters = new Array()
let character = {
    name: '',
    description: '',
    comics: '',
    series: '',
    stories: '',
    avatar: '',
    id: ''
}


const getFavorites = () => {
    let data = JSON.parse(localStorage.getItem("favoritesCharacters"))
    if(data != null){
        data.forEach(element => {
            favoritesCharacters.push(element)
        })
    }
}

if(localStorage.key("favoritesCharacters")){
    getFavorites()
}


const searchAllCharacters = () => {
    fetch(`${urlCharacters}&ts=1&apikey=${apikey}&hash=${apiKeyHash}&limit=43&offset=${offset}`)
        .then(res => res.json())
        .then(res => {
            if(charactersResults.length === 0){
                charactersResults = []
            }
            dataCount = res.data.limit
            countDataResults = res.data.total
            let character2 = { ...character }
            res.data.results.forEach(element => {
                character2 = {
                name: element.name,
                comics: element.comics.available,
                description: element.description,
                series: element.series.available,
                stories: element.stories.available,
                avatar: `${element.thumbnail.path}.jpg`,
                id: element.id
            }
            charactersResults.push(character2)
            });
            createCardsCharacters()
        })
        .catch(err => console.log(err))
}

const searchCharacterByName = name => {
    fetch(`${urlCharacters}&ts=1&apikey=${apikey}&hash=${apiKeyHash}&name=${name}`)
        .then(res => res.json())
        .then(res => {
            charactersResults = []
            let character2 = { ...character }
            if(res.data.results.length === 0){
                deleteLoading()
                titleCardsSection.innerHTML = "Sin resultados"
            }else{
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
            }
            
        })
        .catch(err => console.log(err))
}


const cardsRenderization = (name, source, id) => {
    let container = document.getElementById("container-cards-characters")
    let figure = document.createElement("figure")
    let figcaption = document.createElement("figcaption")
    let img = document.createElement("img")
    let btnAdd = document.createElement("button")
    let columnInfo = document.createElement("div")

    let pos = container.childElementCount - 1
    let div = document.getElementById("container-cards-characters").children[pos]
    div.appendChild(figure)
    figure.appendChild(img)
    figure.appendChild(columnInfo)
    columnInfo.appendChild(figcaption)
    columnInfo.appendChild(btnAdd)
    figcaption.innerHTML = name
    img.src = source
    img.alt = "Imagen del personaje"
    figure.classList = "flex-container"
    let btnAddState;
    if(favoritesCharacters.includes(indexed[id])){
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
            let index = favoritesCharacters.indexOf(indexed[id])
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



const loadingAnimation = () => {
    let box = document.createElement("div")
    let div = document.createElement("div")
    resultsContainer.appendChild(box)
    box.appendChild(div)
    box.classList = "bouncingLoader"
    box.id = "loading-component"
    resultsContainer.style.display = "flex"
    resultsContainer.style.justifyContent = "center" 
    resultsContainer.style.alignItems = "center" 
    resultsContainer.classList = ""
}


const deleteLoading = () => {
    let loadingComponent = document.getElementById("loading-component")
    if(loadingComponent){
        resultsContainer.removeChild(loadingComponent)
    }
}

let indexed = favoritesCharacters.reduce((acc, el) => ({
    ...acc, 
    [el.id]: el
}), {})

const deleteCardsCharacters = () => {
    let containerCardsCharacters = document.getElementById("container-cards-characters")
    let cardCharacterSelected = document.getElementById("card-character-searched")
    if(cardCharacterSelected != null){
        containerCardsCharacters.removeChild(cardCharacterSelected)
    } 
    if(containerCardsCharacters != null){
        resultsContainer.removeChild(containerCardsCharacters)
    }
}

let pageSize = 0;
let limitPages = 0;
let i = 0;
let y = 0;

const createCardsCharacters = async () => {
    let containerCards = document.getElementById("container-cards-characters")
    let container = document.createElement("div")
    if(containerCards === null){
        resultsContainer.appendChild(container)
        container.id = "container-cards-characters"
    }
    cardsContainer.classList = "cards-container"
    barPaginationContainer.classList = "flex-container"

    if(charactersResults.length === 1){
        let article = document.createElement("article")
        container.appendChild(article)
        article.classList = "cards-items"
        article.id = "card-character-searched"
        titleCardsSection.innerHTML = "Resultados"
        deleteLoading()
        limitPages = 1
        cardsRenderization(charactersResults[0].name, charactersResults[0].avatar, charactersResults[0].id)
    }else if(charactersResults.length > 1){
        pageSize += 6
        titleCardsSection.innerHTML = "Todos los superheroes"
        deleteLoading()
        offset += 43
        for(i; i <= pageSize; ++i){
            let nodeParent = resultsContainer.children[0]
            let article = document.createElement("article")
            nodeParent.appendChild(article)
            article.classList = "cards-items"
            limitPages += 6
            if(limitPages < offset){
                for(y; y <= limitPages - 1; ++y){
                    cardsRenderization(charactersResults[y].name, charactersResults[y].avatar, charactersResults[y].id)
                }
            }
        }
        barPagination()
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
    loadingAnimation()
    deleteCardsCharacters()
    searchCharacterByName(searchElement.value)
    document.getElementById("formulario").reset()
})

/**
 * Show all of the characters list
 */

btnShowAll.addEventListener("click", async e => {
    e.preventDefault()
    i= 0;
    loadingAnimation()
    deleteCardsCharacters()
    searchAllCharacters()
})
let p = 0;
const barPagination = () => {
    let amountCards = offset / 6
    $(document).ready(() => {
        let barContainer = $('#bar-pagination-items')
        let cards = $('#container-cards-characters article');
        cards.hide();
        
        let card = cards.eq(0)
        let next = barContainer.eq(0)
    
        card.show();
    
        let pagination = $('<div id="paginas"></div>')
        for(p; p < amountCards - 1; ++p){
            $(`<span class="pagina pagination-items">${p + 1}</span>`).appendTo(pagination);
        }
    
        pagination.insertBefore(next)
    
        $('.pagina').hover(function(){
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        })

        let lastPos = 0;
    
        $('span').click(function(){
            cards.hide()
            let index = parseInt($(this).text() - 1)
            next = cards.eq(index)
            lastPos = index
            cards.addClass('scale-in-center')
            next.show()
        })

        $('#btnNext').click(function(){
            cards.hide()
            let lastIndex = Math.round(amountCards) - 1
            if(lastPos === lastIndex){
                searchAllCharacters()
            }
            next = cards.eq(lastPos + 1)
            cards.addClass('scale-in-center')
            next.show()
            lastPos += 1
        })

        $('#btnBack').click(function(){
            cards.hide()
            next = cards.eq(lastPos - 1)
            cards.addClass('scale-in-center')
            next.show()
        })
    })
}




