let playerOneInput = document.querySelector('.player-one');
let playerTwoInput = document.querySelector('.player-two');
let startSection = document.querySelector('main section');
let startButton = document.querySelector('.start-btn');


let playerOne = {
    name: '',
    score: 0,
};
let playerTwo = {
    name: '',
    score: 0,
};

let players = [playerOne, playerTwo];
let gameTurn = 0;

function removePlayerSelection() {
    startSection.remove();
    let div = document.querySelector('body div');
    div.classList.add('wrap-container');
}

function getPlayerNames() {
    if (
        (playerOneInput.value.trim() == '' &&
            playerTwoInput.value.trim() == '') ||
        playerOneInput.value.trim() == '' ||
        playerTwoInput.value.trim() == ''
    ) {
        alert('Fyll i namn på båda spelarna');
    } else {
        playerOne.name = playerOneInput.value;
        playerTwo.name = playerTwoInput.value;
        startGame();
    }
}

startButton.addEventListener('click', getPlayerNames);
// END PLAYER SELECTION SECTION



// GAME SECTION

// style are inspire by https://play.nintendo.com/activities/memory-match/pokemon-cafe-memory-match-activity/

let classListIndex = []; // Lista för att lagra våra class nummer
let hiddenCard = 'images/cardback.png'; // baksida för korten
let images = [
    // lägger till bilder till korten
    'images/Bulba_resized.png',
    'images/charmander_resized.png',
    'images/eevee_resized.png',
    'images/meowth_resized.png',
    'images/minccino_resized.png',
    'images/munchlax_resized.png',
    'images/pikachu_resized.png',
    'images/snubbull_resized.png',
    'images/squirtle_resized.png',
    'images/starly_resized.png',
    'images/stoutland_resized.png',
    'images/togepi_resized.png',
];

// create a card function
function createNewCard(cardImg) {
    let main = document.querySelector('main');
    let newCardContent = `<img src=${cardImg}>`;
    let newCard = document.createElement('article');
    newCard.innerHTML = newCardContent;
    main.append(newCard);
}

function placeCards() {
    for (let a = 0; a < 2; a++) {
        for (let i = 0; i < images.length; i++) {
            createNewCard(hiddenCard);
            classListIndex.push(i);
        }
    }
}

function shuffleClass() {
    let shuffledNumbers = classListIndex.sort(() => {
        return Math.random() - 0.5;
    });
    return shuffledNumbers;
}

function giveCardClass() {
    let main = document.querySelector('main');
    for (let i = 0; i < classListIndex.length; i++) {
        main.children[i].className = classListIndex[i];

    }
}

function updateDisplays() {
    let aside = document.querySelector('aside');
    let currentPlayer = players[gameTurn];
    let asideContent = `<h3>${currentPlayer.name}s tur</h3>
    <h4>Poäng</h4>
    <p>${playerOne.name}: ${playerOne.score}</p>
    <p>${playerTwo.name}: ${playerTwo.score}</p>`;
    aside.innerHTML = asideContent;

    let playAgainBtn = document.createElement('button');
    playAgainBtn.innerText = 'Spela igen';
    playAgainBtn.addEventListener('click', playAgain);

    let reset = document.createElement('button');
    reset.innerText = 'Välj nya spelare';
    reset.addEventListener('click', resetGame);
    aside.append(playAgainBtn);
    aside.append(reset);
}

function sideBar() {
    let container = document.querySelector('.wrap-container');
    let aside = document.createElement('aside');
    container.append(aside);
    updateDisplays();
}


function addArticleListener() {
    const articleListener = document.querySelectorAll('article');
    for (const article of articleListener) {
        article.addEventListener('click', (event) => {
            flippedCard(event.currentTarget);
        });
    }
}

let flippedCardsList = [];
function flippedCard(card) {
    let main = document.querySelector('main');
    flippedCardsList.push(card);
    card.innerHTML = `<img src=${images[card.className]}>`;
    card.style.pointerEvents = 'none';
    card.setAttribute('name', 'flipped');
    if (flippedCardsList.length >= 2) {
        for (const article of main.children) {
            article.style.pointerEvents = 'none';
        }
        compareFlippedCard();
    }
}

function isCardFlipped() {
    let main = document.querySelector('main');
    for (const article of main.children) {
        if (article.getAttribute('name') != 'flipped') {
            article.style.pointerEvents = 'all';
        }
    }
}


function isGameOver() {
    if (playerOne.score + playerTwo.score == 12) {
        if (playerOne.score == playerTwo.score) {
            setTimeout(() => {
                customAlert('Oavgjort!');
            }, 250);
        } else if (playerOne.score > playerTwo.score) {
            setTimeout(() => {
                customAlert(playerOne.name);
            }, 250);
        } else if (playerOne.score < playerTwo.score) {
            setTimeout(() => {
                customAlert(playerTwo.name);
            }, 250);
        }
    }
}

function compareFlippedCard() {
    let currentPlayer = players[gameTurn];
    if (flippedCardsList[0].className == flippedCardsList[1].className) {
        currentPlayer.score++;
        updateDisplays();
        setTimeout(() => {
            isCardFlipped();
            flippedCardsList = [];
        }, 1000);
        isGameOver();
    } else {
        // Not a match!
        setTimeout(() => {

            flippedCardsList.forEach((card) => {
                card.removeAttribute('name');
                card.innerHTML = `<img src=${hiddenCard}>`;
            });
            isCardFlipped();
            flippedCardsList = [];
            changePlayerTurn();
            updateDisplays();
        }, 1500);
    }
}

function changePlayerTurn() {
    gameTurn = (gameTurn + 1) % 2;
}

function customAlert(winner) {
    let container = document.querySelector('main');

    let section = document.createElement('section');
    section.classList.add('alert-section');

    let imgdiv = document.createElement('div');
    imgdiv.classList.add('img-div');

    let header = document.createElement('h2');
    header.innerText = 'Spelet är över!';

    let sectionText = document.createElement('p');
    sectionText.innerText = 'Vinnare: ' + winner;

    let playAgainBtn = document.createElement('button');
    playAgainBtn.innerText = 'Spela igen';
    playAgainBtn.addEventListener('click', playAgain);

    let reset = document.createElement('button');
    reset.innerText = 'Välj nya spelare';
    reset.addEventListener('click', resetGame);

    section.append(imgdiv);
    section.append(header);
    section.append(sectionText);
    section.append(playAgainBtn);
    section.append(reset);
    container.append(section);
    setTimeout(() => {
        section.style.transform = 'rotate(360deg)';
        section.style.transition = '1.5s cubic-bezier(0.75, 0.4, 0.4, 1.4)';
    }, 1);
}

function resetGame() {
    location.reload();
}

// play again knappen
function playAgain() {
    flippedCardsList = [];
    classListIndex = [];
    gameTurn = 0;
    playerOne.score = 0;
    playerTwo.score = 0;
    clearBoard();
    startGame();
}

// Tar bort alla emement så dom kan skapas om igen när vi börjar spelet
function clearBoard() {
    let main = document.querySelector('main');
    let aside = document.querySelector('aside');
    let container = document.querySelector('.wrap-container');
    let alertSection = document.querySelector('.alert-section');
    main.remove();
    aside.remove();
    if (alertSection != null) {
        alertSection.remove();
    }
    let newMain = document.createElement('main');
    container.append(newMain);
}

function startGame() {
    removePlayerSelection();
    sideBar();
    placeCards();
    shuffleClass();
    giveCardClass();
    addArticleListener();
}
