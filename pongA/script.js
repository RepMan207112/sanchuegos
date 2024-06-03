let gameStarted = false;
let gamePaused = false;
let gameOver = false;

let leftScore = 0;
let rightScore = 0;
let finalScore = 3;
let scoreFactor = 1;
let speed = 3 * scoreFactor;
let angle = Math.random() * 2 * Math.PI;

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const player1Name = document.getElementById("player1Name");
const player1Score = document.getElementById("player1Score");
const player2Name = document.getElementById("player2Name");
const player2Score = document.getElementById("player2Score");

const gameOverScreen = document.getElementById("gameOverScreen");
const winnerText = document.getElementById("winnerText");
const restartButton = document.getElementById("restartButton");

const speedIncreaseFactor = 0.1; // Zvýší rychlost míčku o 10% po každém odražení
const bounciness = 0.1; // Rychlost míčku ve vertikálním směru se může změnit až o 10% v závislosti na tom, kde se dotkne paddle

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 2,
    dy: -2,
    radius: 10
};
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
const leftPaddle = {
    width: 15,
    height: 80,
    x: 0,
    y: (canvas.height - 80) / 2,
    dy: 2,
    color: "#00FF00",
    upKey: 'KeyW',
    downKey: 'KeyS'
};
const rightPaddle = {
    width: 15,
    height: 80,
    x: canvas.width - 15,
    y: (canvas.height - 80) / 2,
    dy: 2,
    color: "#FF0000",
    upKey: 'ArrowUp',
    downKey: 'ArrowDown'
};
const settingsPanel = document.getElementById('settingsPanel');
const settingsButton = document.querySelector('#settingsButton');

settingsButton.addEventListener('click', function() {
    if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
        gamePaused = true;
    } else {
        settingsPanel.style.display = 'none';
        gamePaused = false;
    }
});
document.querySelector('#settingsButton img').addEventListener('click', function() {
    if (this.classList.contains('active')) {
        this.classList.remove('active');
        this.style.animation = 'rotation0 0.75s forwards';
    } else {
        this.classList.add('active');
        this.style.animation = 'rotation180 0.75s forwards';
    }
});
document.getElementById('leftPaddleColor').addEventListener('input', function() {
    leftPaddle.color = this.value;
});
document.getElementById('rightPaddleColor').addEventListener('input', function() {
    rightPaddle.color = this.value;
});
document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Získá jména hráčů z inputů
    const player1NameInput = document.getElementById('player1NameInput').value;
    const player2NameInput = document.getElementById('player2NameInput').value;

    // Aktualizuje jména hráčů pokud byla zadána
    if (player1NameInput !== '') {
        document.getElementById('player1Name').textContent = player1NameInput;
    }
    if (player2NameInput !== '') {
        document.getElementById('player2Name').textContent = player2NameInput;
    }
    // Schova gameMenu a zobrazí pongCanvas
    document.getElementById('gameMenu').style.display = 'none';
    gameStarted = true; // Start the game
});
function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

function updatePaddlePosition(paddle) {
    paddle.y += paddle.dy;
    if (paddle.y < 0) {
        paddle.y = 0;
    } else if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}
function controlPaddle(event, paddle) {
    if (event.code === paddle.upKey) {
        paddle.dy = -4;
    } else if (event.code === paddle.downKey) {
        paddle.dy = 4;
    }
}
document.addEventListener('keydown', function(event) {
    controlPaddle(event, leftPaddle);
    controlPaddle(event, rightPaddle);
});
document.addEventListener('keyup', function(event) {
    if (event.code === leftPaddle.upKey || event.code === leftPaddle.downKey) {
        leftPaddle.dy = 0;
    }
    if (event.code === rightPaddle.upKey || event.code === rightPaddle.downKey) {
        rightPaddle.dy = 0;
    }
});
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Generuje nový náhodný úhel pokaždé, když se míček resetuje
    let randomNum = Math.random();
    if (randomNum < 1/3) {
        // Generuje úhel v intervalu 0 - 60 stupňů
        angle = Math.random() * (Math.PI / 3);
    } else if (randomNum < 2/3) {
        // Generuje úhel v intervalu 120 - 240 stupňů
        angle = (Math.random() * (Math.PI / 3)) + (2 * Math.PI / 3);
    } else {
        // Generuje úhel v intervalu 300 - 360 stupňů
        angle = (Math.random() * (Math.PI / 3)) + (5 * Math.PI / 3);
    }

    ball.dx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
}
function draw() {
    if (gameStarted && !gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update player scores
        player1Score.textContent =  leftScore;
        player2Score.textContent =  rightScore;

        if (!gameOver) {
            drawBall();
            drawPaddle(leftPaddle);
            drawPaddle(rightPaddle);
            updatePaddlePosition(leftPaddle);
            updatePaddlePosition(rightPaddle);

            // Míček se dotkne horního nebo dolního okraje
            if (ball.y + ball.dy < ball.radius || ball.y + ball.dy > canvas.height - ball.radius) {
                ball.dy = -ball.dy;
            }

            // Míček se dotkne levého paddle
            if (ball.dx < 0 && ball.x - ball.radius <= leftPaddle.x + leftPaddle.width && ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
                ball.dx = -(ball.dx * (1 + speedIncreaseFactor));
                ball.dy += (ball.y - (leftPaddle.y + leftPaddle.height / 2)) * bounciness;
            }

            // Míček se dotkne pravého paddle
            if (ball.dx > 0 && ball.x + ball.radius >= rightPaddle.x && ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
                ball.dx = -(ball.dx * (1 + speedIncreaseFactor));
                ball.dy += (ball.y - (rightPaddle.y + rightPaddle.height / 2)) * bounciness;
            }
            // Check if the ball hit the left or right edge
            else if (ball.x + ball.dx < ball.radius) {
                // Míček se dotkne levého okraje, zvýšíme skóre pravého hráče a resetujeme míček
                rightScore++;
                scoreFactor = 1 + (leftScore + rightScore) * 0.05;
                if (rightScore === (finalScore - 1) && leftScore === (finalScore - 1)) {
                    finalScore++;
                }
                if (rightScore === finalScore) {
                    gameOver = true;
                    winnerText.textContent =  player2Name.textContent + " is the winner!";
                    gameOverScreen.style.display = "flex";
                } else {
                    resetBall();
                }
            } else if (ball.x + ball.dx > canvas.width - ball.radius) {
                // Míček se dotkne pravého okraje, zvýšíme skóre levého hráče a resetujeme míček
                leftScore++;
                scoreFactor = 1 + (leftScore + rightScore) * 0.05;
                if (rightScore === (finalScore - 1) && leftScore === (finalScore - 1)) {
                    finalScore++;
                }
                if (leftScore === finalScore) {
                    gameOver = true;
                    winnerText.textContent =  player1Name.textContent + " is the winner!";
                    gameOverScreen.style.display = "flex";
                } else {
                    resetBall();
                }
            } else {
                ball.x += ball.dx;
                ball.y += ball.dy;
            }
        }
    }
}
restartButton.addEventListener("click", function() {
    leftScore = 0;
    rightScore = 0;
    gameOver = false;
    gameOverScreen.style.display = "none";
    resetBall();
});

setInterval(draw, 10);