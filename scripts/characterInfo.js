let information;
const nameCharacter = document.getElementById("nameCharacter")
const descriptionCharacter = document.getElementById("descriptionCharacter")
const seriesCharacter = document.getElementById("seriesCharacter")
const avatarCharacter = document.getElementById("avatarCharacter")
const apikey = '4d67d9b046ef7a410630968647c8c3b1'
const apiKeyHash = '9031491d74ced7315a4461102ad79545'

const getCharacterInfo = () => {
    information = JSON.parse(localStorage.getItem("characterSelected"))
}

getCharacterInfo()


const renderInformation = () => {
    nameCharacter.innerHTML = information[0].name
    avatarCharacter.src = information[0].avatar
    descriptionCharacter.innerHTML = information[0].description
    seriesCharacter.innerHTML = `Cantidad de series ${information[0].series}`
}

renderInformation()