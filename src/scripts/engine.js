const State = {
    score: {
        playerScore: 0,
        computerScore:0,
        scoreBox: document.getElementById('score-points')
    },

    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    playerSides: {
        player1: "player-cards",
        computer: "computer-cards",
        player1BOX : document.querySelector('#player-cards'),
        computerBOX: document.querySelector('#computer-cards')
    },

    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },

    button: document.getElementById('next-duel')
}

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    }
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function creatCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img")
    cardImage.setAttribute('height', '100px')
    cardImage.setAttribute('src', './src/assets/icons/card-back.png')
    cardImage.setAttribute('data-id', idCard)
    cardImage.classList.add('card')


    if(fieldSide === State.playerSides.player1){
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'))
        })

        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(idCard)
        })
    }

    

    return cardImage
}

async function updateScore(){
    State.score.scoreBox.innerText = `Win: ${State.score.playerScore} | Lose: ${State.score.computerScore}`
}

async function setCardsField(cardId){
    await removeAllCardsImages()
    let computerCardId = await getRandomCardId()
    State.fieldCards.player.style.display = 'block'
    State.fieldCards.computer.style.display = 'block'
    State.cardSprites.avatar.src = ''
    State.cardSprites.name.innerText = ''
    State.cardSprites.type.innerText = ''
    State.fieldCards.player.src = cardData[cardId].img
    State.fieldCards.computer.src = cardData[computerCardId].img
    let duelResults = await checkDuelResults(cardId, computerCardId)
    await updateScore()
    await drawButton(duelResults)
}



async function drawButton(text){
    State.button.innerText = text
    State.button.style.display = 'block'
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId()
        const cardImage = await creatCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }


}

async function drawSelectCard(index){
    State.cardSprites.avatar.src = cardData[index].img
    State.cardSprites.name.innerText = cardData[index].name
    State.cardSprites.type.innerText = "Attibute : " + cardData[index].type
}

async function removeAllCardsImages(){
    let cards = State.playerSides.computerBOX 
    let imgElements = cards.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())

    cards = State.playerSides.player1BOX
    imgElements = cards.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = 'Empate'
    let playerCard = cardData[playerCardId]
    
    
    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win"
        
        State.score.playerScore++
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose"
        State.score.computerScore++
    }

    await playAudio(duelResults)

    return duelResults
}

async function resetDuel(){
    State.cardSprites.avatar.src = ''
    State.button.style.display = 'none'
    State.fieldCards.player.style.display = 'none'
    State.fieldCards.computer.style.display = 'none'

    init()
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    

    try{
        audio.play()
    }catch{

    }
}


function init(){
    drawCards(5, State.playerSides.player1)
    drawCards(5, State.playerSides.computer)

    const bgm = document.getElementById('bgm')
    bgm.play()
}

init()

