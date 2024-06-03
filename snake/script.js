document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const gridSize = 20;
    let snake = [{ x: 5, y: 5 }];
    let food = generateFood();
    let direction = 'right';
    let isGameOver = false;
    let score = 0;

    function increaseScore() {
        score += 1;
        document.getElementById('score').innerText = score;

        if (score >= (gridSize * gridSize - 1)){
            isGameOver = true;
            document.getElementById('winnerText').innerText = "YOU WIN!";
        }
    }
    function generateFood() {
        let x, y;
        while (true) {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);

            let collision = snake.some(segment => segment.x === x && segment.y === y);
            if (!collision) break;
        }
        return { x, y };
    }

    function draw() {
        gameBoard.innerHTML = '';

        // Draw snake
        snake.forEach((segment, index) => {
            const snakeElement = document.createElement('div');
            snakeElement.classList.add('snake');
            snakeElement.style.left = `${segment.x * 20}px`;
            snakeElement.style.top = `${segment.y * 20}px`;
            gameBoard.appendChild(snakeElement);

            if (index === 0) {
                const eye1 = document.createElement('div');
                const eye2 = document.createElement('div');
                eye1.classList.add('eye');
                eye2.classList.add('eye');
                snakeElement.appendChild(eye1);
                snakeElement.appendChild(eye2);
            }
        });

        // Draw food
        const foodElement = document.createElement('div');
        foodElement.classList.add('food');
        foodElement.style.left = `${food.x * 20}px`;
        foodElement.style.top = `${food.y * 20}px`;
        gameBoard.appendChild(foodElement);
    }

    function move() {
        const head = { ...snake[0] };

        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
/*
        //Snake se při nárazu do zdi objeví na opačné straně
        if (head.x < 0) {
            head.x = gridSize - 1;
        } else if (head.x >= gridSize) {
            head.x = 0;
        }
        if (head.y < 0) {
            head.y = gridSize - 1;
        } else if (head.y >= gridSize) {
            head.y = 0;
        }
*/
        snake.unshift(head);

        // Kontakt s jídlem
        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
            increaseScore();
        } else {
            snake.pop();
        }

        // Kontakt s okrajem
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            isGameOver = true;
        }

        // Náraz do sebe
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                isGameOver = true;
                break;
            }
        }
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
    restartButton.addEventListener("click", function() {
        isGameOver = false;
        gameOverScreen.style.display = "none";
        location.reload();
    });
    function gameLoop() {
        if (!isGameOver) {
            move();
            draw();
            setTimeout(gameLoop, 100);
        }
        else{
            gameOverScreen.style.display = "flex";
        }
    }
    document.addEventListener('keydown', handleKeyPress);
    gameLoop();
});