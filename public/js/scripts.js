const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : ''; // Use relative paths in production

async function fetchAds(gameType) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ads/${gameType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ads');
    }
    const data = await response.json();
    console.log('Ad Data:', data);
    // Use the ad data in your frontend
  } catch (error) {
    console.error('Fetch Ads Error:', error.message);
  }
}

async function saveGameProgress(gameType, progress, earnings) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/games/update-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameType, progress, earnings }),
    });

    if (!response.ok) {
      throw new Error('Failed to save game progress');
    }

    const data = await response.json();
    console.log('Game progress saved:', data);
    return data;
  } catch (error) {
    console.error('Error saving game progress:', error.message);
    alert('⚠️ Progress not saved (check connection)');
  }
}

fetchAds('memory'); // Example API call

// Centralized game logic for Memory Match, Lucky Dice, Snake Game, Trivia Quiz, and Lucky Wheel

// Memory Match Game
function initializeMemoryGame() {
    const gameBoard = document.getElementById('memoryGameBoard');
    const cards = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍋', '🍐', '🍇'];
    const shuffledCards = [...cards, ...cards].sort(() => Math.random() - 0.5);

    gameBoard.innerHTML = '';
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.addEventListener('click', () => flipCard(cardElement));
        gameBoard.appendChild(cardElement);
    });

    let flippedCards = [];
    function flipCard(card) {
        if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
            card.classList.add('flipped');
            card.textContent = card.dataset.value;
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                checkMatch();
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add('matched');
            card2.classList.add('matched');
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
            }, 1000);
        }
        flippedCards = [];
    }
}

// Lucky Dice Game
function initializeLuckyDiceGame() {
    const rollButton = document.getElementById('rollDiceButton');
    const diceResult = document.getElementById('diceResult');

    rollButton.addEventListener('click', () => {
        const roll = Math.floor(Math.random() * 6) + 1;
        diceResult.textContent = `You rolled a ${roll}`;
    });
}

// Snake Game
function initializeSnakeGame() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    let snake = [{ x: 10, y: 10 }];
    let direction = 'RIGHT';
    let food = { x: 15, y: 15 };

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.forEach(segment => {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
        });
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
    }

    function moveSnake() {
        const head = { ...snake[0] };
        if (direction === 'RIGHT') head.x++;
        if (direction === 'LEFT') head.x--;
        if (direction === 'UP') head.y--;
        if (direction === 'DOWN') head.y++;

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            food = { x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) };
        } else {
            snake.pop();
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
        if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    });

    setInterval(() => {
        moveSnake();
        draw();
    }, 100);
}

// Trivia Quiz Game
function initializeTriviaQuizGame() {
    const questionElement = document.getElementById('triviaQuestion');
    const optionsElement = document.getElementById('triviaOptions');
    const questions = [
        { question: 'What is the capital of Nigeria?', options: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'], answer: 1 },
        { question: 'Who is the current president of Nigeria?', options: ['Buhari', 'Jonathan', 'Obasanjo', 'Yar Adua'], answer: 0 }
    ];

    let currentQuestionIndex = 0;

    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(index));
            optionsElement.appendChild(button);
        });
    }

    function checkAnswer(selectedIndex) {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedIndex === currentQuestion.answer) {
            alert('Correct!');
        } else {
            alert('Wrong!');
        }
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        loadQuestion();
    }

    loadQuestion();
}

// Lucky Wheel Game
function initializeLuckyWheelGame() {
    const spinButton = document.getElementById('spinWheelButton');
    const wheelResult = document.getElementById('wheelResult');
    const prizes = ['₦0', '₦100', '₦200', '₦500', '₦1000'];

    spinButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * prizes.length);
        wheelResult.textContent = `You won ${prizes[randomIndex]}!`;
    });
}

// Export functions for use in both index.html and games.html
export {
    initializeMemoryGame,
    initializeLuckyDiceGame,
    initializeSnakeGame,
    initializeTriviaQuizGame,
    initializeLuckyWheelGame
};
