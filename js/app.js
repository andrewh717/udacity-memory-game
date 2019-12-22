// inital setup
let timer;
let moves = 0;
let stars = 3;
let matchedPairs = 0;
let moveCounter = document.getElementById('move-counter');
let game = document.getElementById('game');
let win = document.getElementById('winner-screen');
let winMoves = document.getElementById('win-moves');
let winStars = document.getElementById('win-stars');
initGame();


// Starts the game
function initGame() {
	matchedPairs = 0;
	moves = 0;
	stars = 3;
	moveCounter.innerText = moves.toString();
	displayCards();
	initCardListener();
}

/*
 * Create a list that holds all of your cards
 */
function createDeck() {
	let deck = new Array(16);
	let symbols = ['anchor', 'bicycle', 'bolt', 'bomb', 'cube', 'diamond', 'leaf', 'paper-plane-o'];
	let j = 0;
	for (let i = 0; i < deck.length; i++) {
		if (i > 0 && i % 2 == 0) {
			j++;
		}
		deck[i] = {
			symbol: symbols[j]
		}
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
	let deck = shuffle(createDeck());
	let list = document.getElementById('deck');
	deck.forEach(card => {
		let item = document.createElement('li');
		let symbol = document.createElement('i');
		item.classList.add('card');
		symbol.classList.add('fa', 'fa-' + card.symbol);
		item.appendChild(symbol);
		list.appendChild(item);
	});
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *  + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *  + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *  + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *  + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function initCardListener() {
	let cards = document.querySelectorAll('.card');
	let openCards = [];
	cards.forEach(card => {
		card.addEventListener('click', function (event) {
			if (card.classList.value === 'card') {
				if (openCards.length < 2) {
					card.classList.add('open', 'show');
					openCards.push(card);
					if (openCards.length == 2) {
						setTimeout(function() {
							checkMatch(openCards);
							incrementMove();
							openCards = [];
						}, 100);
					}
				}
			}
		});
	});
}

// Function to check if the open cards are a match
function checkMatch(openCards) {
	if (openCards[0].isEqualNode(openCards[1]) && !openCards[0].isSameNode(openCards[1])) {
		// Match found
		openCards.forEach(card => {
			handleMatch(card);
		});
		matchedPairs++;
		if (matchedPairs == 8) {
			winner();
		}
	} else {
		// Not a match
		openCards.forEach(card => {
			handleIncorrect(card);
		});
	}
}

function incrementMove() {
	moves++;
	moveCounter.innerText = moves.toString();
	if (moves > 10) {
		if (moves <= 15) {
			stars = 2;
			removeStar(3);
		} else if (moves <= 20) {
			stars = 1;
			removeStar(2);
		}
		// Commenting out the 0 star rating since rubric says only go down to 1 star
		// } else {
		// 	stars = 0;
		// 	removeStar(1);
		// }
	}
}

function removeStar(num) {
	let star = document.getElementById('star' + num);
	star.classList.remove('fa-star');
	star.classList.add('fa-star-o');
}

function handleMatch(card) {
	card.classList.remove('open', 'show');
	card.classList.add('match');
}

function handleIncorrect(card) {
	card.classList.remove('open', 'show');
	card.classList.add('incorrect');
	setTimeout(function() {
		card.classList.remove('incorrect');
	}, 700);
}

function winner() {
	game.style.display = 'none';
	win.style.display = 'flex';
	winMoves.innerText = moves;
	winStars.innerText = stars;
}

function resetDeck() {
	document.getElementById('deck').innerHTML = '';
}

function resetStars() {
	let starsList = document.getElementById('starsList');
	starsList.innerHTML = '';
	for (let i = 1; i < 4; i++) {
		let star = document.createElement('li');
		let starSymbol = document.createElement('i');
		starSymbol.classList.add('fa', 'fa-star');
		starSymbol.id = 'star'+ i;
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