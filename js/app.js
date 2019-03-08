const cards = ["far fa-gem",
               "far fa-paper-plane",
               "fas fa-anchor",
               "fas fa-bolt",
               "fas fa-cube",
               "fas fa-leaf",
               "fas fa-bicycle",
               "fas fa-bomb"];

let movesCount = 0;
let timerTotalSeconds = 0;
let timerInterval;

function init() {
  movesCount = 0;
  startTimer();

  updateMoveCounter();
  updateStarRating();

  const gameContainer = document.querySelector('.game-container');
  gameContainer.classList.remove('hide', 'show', 'closing');
  gameContainer.classList.add('show');

  const successContainer = document.querySelector('.success-container');
  successContainer.classList.remove('hide', 'show');
  successContainer.classList.add('hide');

  const shuffledCards = shuffle(cards.concat(cards));
  let deckContent = '';
  for (const card of shuffledCards) {
    deckContent += `<div class="card">
                      <div class ="card-item-wrapper">
                        <li class ="card-item" data-type="${card}">
                          <i class="${card}"></i>
                        </li>
                      </div>
                    </div>`;
  }

  const deck = document.querySelector('.deck');
  deck.innerHTML = deckContent;

  const allCards = document.querySelectorAll('.card-item');
  for (const card of allCards) {
    card.addEventListener('click', openCard);
  }
}

function openCard(evt) {
  const currentClickedCard = this; /*evt.target*/

  const notMatchedCardsStillShowed = document.querySelectorAll('.card-item.nomatch').length > 0;
  if (notMatchedCardsStillShowed) {
    return;
  }

  let openCards = document.querySelectorAll('.card-item.open');

  // Turn around the clicked card -> do not allow to open more than 2 cards at the same time
  if (openCards.length < 2 && !currentClickedCard.classList.contains('open') && !currentClickedCard.classList.contains('matched') && !currentClickedCard.classList.contains('nomatched')) {
    currentClickedCard.classList.add('open', 'show');
    openCards = document.querySelectorAll('.card-item.open');
  } else {
    return;
  }

  if (openCards.length == 2) {
    movesCount += 1;
    updateMoveCounter();
    updateStarRating();

    const firstCard = openCards[0];
    const secondCard = openCards[1];

    if (firstCard.dataset.type === secondCard.dataset.type) {
      // Opended cards matched
      setTimeout(function() {
        for (const card of openCards) {
          card.classList.remove('open', 'show');
          card.classList.add('match');
        }
      }, 1000)

      const allCardsCnt = cards.length * 2;
      const matchedCardsCnt = document.querySelectorAll('.card-item.match').length + 2;

      if (allCardsCnt === matchedCardsCnt) {
        // Game win
        stopTimer();
        showSuccessPanel();
      }
    } else {
      // opened cards not matched
      setTimeout(function() {
        for (const card of openCards) {
          card.classList.remove('open', 'show');
          card.classList.add('nomatch');
        }
      }, 1000)

      setTimeout(function() {
        for (const card of openCards) {
          card.classList.remove('nomatch');
        }
      }, 2000)
    }
  }
}

function updateMoveCounter() {
  document.querySelector('.movesCount').textContent = movesCount;
  if (movesCount === 1) {
    document.querySelector('.movesText').textContent = 'Move';
  } else {
    document.querySelector('.movesText').textContent = 'Moves';
  }
}

function getStarRating() {
  let starRating;

  if (movesCount <= 12) {
    starRating = 3;
  } else if (movesCount <= 20) {
    starRating = 2;
  } else {
    starRating = 1;
  }
  return starRating;
}

function updateStarRating() {
  const starRating = getStarRating();
  const stars = document.querySelectorAll('.stars .fa-star');

  if (starRating === 3) {
    stars[0].className = 'fas fa-star';
    stars[1].className = 'fas fa-star';
    stars[2].className = 'fas fa-star';
  } else if (starRating === 2) {
    stars[0].className = 'fas fa-star';
    stars[1].className = 'fas fa-star';
    stars[2].className = 'far fa-star';
  } else {
    stars[0].className = 'fa fa-star';
    stars[1].className = 'far fa-star';
    stars[2].className = 'far fa-star';
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
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

// Inspiration from https://www.w3schools.com/howto/howto_js_countdown.asp
function startTimer() {
  function setTime() {
    timerTotalSeconds += 1;
    document.querySelector('.timerVal').textContent = getFormatedTime(timerTotalSeconds);
  }

  // Reset and start it directly -> otherwise we would have an delay of 1 second
  timerTotalSeconds = 0;
  clearInterval(timerInterval);
  setTime();

  timerInterval = setInterval(setTime, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function showSuccessPanel() {
  const gameContainer = document.querySelector('.game-container');
  gameContainer.classList.remove('hide', 'show', 'closing');
  gameContainer.classList.add('closing');

  // Wait for animation
  setTimeout(function() {
    gameContainer.classList.add('hide');
  }, 500);

  const successContainer = document.querySelector('.success-container');
  successContainer.classList.remove('hide', 'show');
  successContainer.classList.add('show');

  document.querySelector('.total-moves').textContent = movesCount;
  document.querySelector('.total-stars').textContent = getStarRating();
  document.querySelector('.total-play-time').textContent = getFormatedTime(timerTotalSeconds);
  document.querySelector('.review-text').textContent = getReviewText();
}

function getFormatedTime(totalSeconds) {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return `${minutes}:${seconds}`;
}

function getReviewText() {
  const starRating = getStarRating();

  let text;
  if (starRating == 3) {
    text = 'Wohooo';
  } else if (starRating == 2) {
    text = 'Good job!';
  } else {
    text = 'Not bad but you can do it better!'
  }
  return text;
}

init();

const restartBtn = document.querySelector('.score-panel .restart-button');
restartBtn.addEventListener('click', init);

const playAgainBtn = document.querySelector('.success-container .play-again-button');
playAgainBtn.addEventListener('click', init);
