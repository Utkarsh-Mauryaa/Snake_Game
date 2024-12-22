// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text')
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const sound = document.getElementById('sound');


// // Sounds
const gameOverSound = new Audio('Assets/game-over-39-199830.mp3');
const eatingSound = new Audio('Assets/eating-sound-effect-36186.mp3');






// Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;
let snakeHead;





// Draw game map, snake, food
function draw() {
    if(!gameStarted) return;
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();

}

// Draw snake
function drawSnake() {
    let newHead = snake[0];
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
    transformHead(newHead);
    
    

}

// Create a snake or food cube/div
function createGameElement(tag, NameofClass) {
    const element = document.createElement(tag);
    element.className = NameofClass;
    return element;

}

// Set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridRow = position.y;
    element.style.gridColumn = position.x;
}

// Draw food function
function drawFood() {
    if(gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);

    }
}

// Generate food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    for(let i = 0; i < snake.length; i++) {
    while(x === snake[i].x && y === snake[i].y) {
        x = Math.floor(Math.random() * gridSize) + 1;
        y = Math.floor(Math.random() * gridSize) + 1;

    }
    }
    return {x,y};

    
}

// Move the snake
function move() {
    const head = {...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);
    
    

    // snake.pop();
    if(head.x === food.x && head.y === food.y) {
        eatingSound.play();
        food = generateFood();
        clearInterval(gameInterval); // Clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }

}


// Test moving
// setInterval(() => {
//     move(); // Move first
//     draw(); // Then draw again new position
// }, 200)

// Start game function
function startGame() {
    gameStarted = true; // keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Create a keypress listener
function handleKeyPress(event) {
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
          startGame();
    }
    else {
        switch(event.key) {
            case 'ArrowUp' :
                if(direction === 'down') {
                    return;
                }
                direction = 'up'
                break;
            case 'ArrowDown' :
                if(direction === 'up') {
                    return;
                }
                direction = 'down'
                break;
            case 'ArrowLeft' :
                if(direction === 'right') {
                    return;
                }
                direction = 'left'
                break;
            case 'ArrowRight' :
                if(direction === 'left') {
                    return;
                }
                direction = 'right'
                break;
        }
    }
}
document.addEventListener('keydown', handleKeyPress);
function increaseSpeed() {
    if(gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
        
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
   else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
        } 
}
function checkCollision() {
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
        
        
    }
}
function resetGame() {
    board.innerHTML = '';
    updateHighScore();
    stopGame();
    snake = [{x : 10, y : 10}];
    food = generateFood(); 
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
    
}
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    showGameOver();
    setTimeout(() => {
        board.innerHTML = '';
        instructionText.style.display = 'block'
        logo.style.display = 'block';
    }, 2000);
    
}
function updateHighScore() {
    const currentScore = snake.length - 1;
    if(currentScore > highScore) {
        highScore = currentScore;

        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block'


}
function transformHead(head) {
    const newHeadElement = createGameElement('div', 'head');
    setPosition(newHeadElement, head);
    board.appendChild(newHeadElement);
}

function showGameOver() {
        board.innerHTML = '<div class = "gameOver">Game over</div>';
        gameOverSound.play();
    
}


