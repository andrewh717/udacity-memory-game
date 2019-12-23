/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */

// inital setup
let moves;
let stars;
let openCards;
let matchedPairs;
let startTime;
let endTime;
let time;
const moveCounter = document.getElementById('move-counter');
const game = document.getElementById('game');
const win = document.getElementById('winner-screen');
const winMoves = document.getElementById('win-moves');
const winStars = document.getElementById('win-stars');
const winTime = document.getElementById('win-time');

initGame();

// Starts the game
function initGame() {
  matchedPairs = 0;
  moves = 0;
  stars = 3;
  openCards = [];
  moveCounter.innerText = moves.toString();
  displayCards();
  initCardListener();
  startTime = performance.now();
}

/*
 * Create a list that holds all of your cards
 */
function createDeck() {
  const deck = new Array(16);
  const symbols = ['anchor', 'bicycle', 'bolt', 'bomb', 'cube', 'diamond', 'leaf', 'paper-plane-o'];
  let j = 0;
  for (let i = 0; i < deck.length; i++) {
    if (i > 0 && i % 2 === 0) {
      j++;
    }
    deck[i] = {
      symbol: symbols[j],
    };
  }
  return deck;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards() {
  const deck = shuffle(createDeck());
  const list = document.getElementById('deck');
  deck.forEach((card) => {
    const item = document.createElement('li');
    const symbol = document.createElement('i');
    item.classList.add('card');
    symbol.classList.add('fa', `fa-${card.symbol}`);
    item.appendChild(symbol);
    list.appendChild(item);
  });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue; let
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function handleMatch(card) {
  card.classList.remove('open', 'show');
  card.classList.add('match');
}

function handleIncorrect(card) {
  card.classList.remove('open', 'show');
  card.classList.add('incorrect');
  setTimeout(() => {
    card.classList.remove('incorrect');
  }, 700);
}

function winner() {
  endTime = performance.now();
  time = (endTime - startTime) / 1000;
  game.style.display = 'none';
  win.style.display = 'flex';
  winMoves.innerText = moves;
  winStars.innerText = stars;
  winTime.innerText = time;
}

// Function to check if the open cards are a match
function checkMatch() {
  if (openCards[0].isEqualNode(openCards[1]) && !openCards[0].isSameNode(openCards[1])) {
    // Match found
    openCards.forEach((card) => {
      handleMatch(card);
    });
    matchedPairs++;
    if (matchedPairs === 8) {
      winner();
    }
  } else {
    // Not a match
    openCards.forEach((card) => {
      handleIncorrect(card);
    });
  }
}

function removeStar(num) {
  const star = document.getElementById(`star${num}`);
  star.classList.remove('fa-star');
  star.classList.add('fa-star-o');
}

function incrementMove() {
  moves++;
  moveCounter.innerText = moves.toString();
  if (moves > 11 && moves <= 15) {
    stars = 2;
    removeStar(3);
  } else if (moves > 15 && moves <= 20) {
    stars = 1;
    removeStar(2);
  }
}

function handleCardClick(event) {
  if (event.target.nodeName === 'LI') {
    const card = event.target;
    if (card.classList.value === 'card') {
      if (openCards.length < 2) {
        card.classList.add('open', 'show');
        openCards.push(card);
        if (openCards.length === 2) {
          setTimeout(() => {
            checkMatch();
            incrementMove();
            openCards = [];
          }, 100);
        }
      }
    }
  }
}

function initCardListener() {
  const deck = document.getElementById('deck');
  deck.addEventListener('click', handleCardClick);
}

function resetDeck() {
  document.getElementById('deck').innerHTML = '';
}

function resetStars() {
  const starsList = document.getElementById('starsList');
  starsList.innerHTML = '';
  for (let i = 1; i < 4; i++) {
    const star = document.createElement('li');
    const starSymbol = document.createElement('i');
    starSymbol.classList.add('fa', 'fa-star');
    starSymbol.id = `star${i}`;
    star.appendChild(starSymbol);
    starsList.appendChild(star);
  }
}

function restartGame() {
  game.style.display = 'flex';
  win.style.display = 'none';
  resetDeck();
  resetStars();
  initGame();
}
