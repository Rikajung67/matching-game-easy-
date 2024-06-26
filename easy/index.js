const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  // Select 6 unique cards
  const uniqueCards = cards.slice(0, 6);
  // Duplicate each unique card to create pairs
  const duplicatedCards = [...uniqueCards, ...uniqueCards];
  // Shuffle the duplicated cards' positions
  shuffleCards(duplicatedCards);
  // Display the shuffled duplicated cards on the grid
  for (let i = 0; i < duplicatedCards.length; i++) {
    const randomIndex = Math.floor(Math.random() * duplicatedCards.length);
    [duplicatedCards[i], duplicatedCards[randomIndex]] = [duplicatedCards[randomIndex], duplicatedCards[i]];
  }
  for (let card of duplicatedCards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>`;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}


function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  updateScore();

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
  if (document.querySelectorAll('.card:not(.flipped)').length === 0){}
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function updateScore() {
  score++;
  document.querySelector(".score").textContent = score;
}
