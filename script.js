const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth - 20;
canvas.height = window.innerHeight > 800 ? 800 : window.innerHeight - 20;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 4,
    dy: -4,
    speed: 6
};

const paddle = {
    width: 150,
    height: 20,
    x: canvas.width / 2 - 75,
    y: canvas.height - 50,
    speed: 20
};

const blockRowCount = 5;
const blockColumnCount = 8;
const blockWidth = (canvas.width - 2 * 35) / blockColumnCount;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 50;
const blockOffsetLeft = 35;

let blocks = [];
let deathCount = 0;
const maxDeaths = 5;
let blockCount = blockRowCount * blockColumnCount;
let gameOver = false;

for (let c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (let r = 0; r < blockRowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// New event listeners for mouse/touch controls
canvas.addEventListener('mousemove', mouseMoveHandler);
canvas.addEventListener('touchmove', touchMoveHandler);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

function touchMoveHandler(e) {
    const touchX = e.touches[0].clientX - canvas.offsetLeft;
    if (touchX > 0 && touchX < canvas.width) {
        paddle.x = touchX - paddle.width / 2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawBlocks() {
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
            if (blocks[c][r].status === 1) {
                const blockX = c * (blockWidth + blockPadding) + blockOffsetLeft;
                const blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
            const block = blocks[c][r];
            if (block.status === 1) {
                if (
                    ball.x > block.x &&
                    ball.x < block.x + blockWidth &&
                    ball.y > block.y &&
                    ball.y < block.y + blockHeight
                ) {
                    ball.dy = -ball.dy;
                    block.status = 0;
                    blockCount--;
                    if (blockCount === 0) {
                        drawWin();
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if (ball.y + ball.radius > canvas.height) {
        deathCount++;
        resetBall();
    }

    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy = -ball.dy;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -ball.dy;
}

function drawDeathCount() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Deaths: ${deathCount}`, 20, 30);
}

function drawGameOver() {
    ctx.font = '50px Arial';
    ctx.fillStyle = '#ff0000';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    document.getElementById('retryButton').style.display = 'block';
}

function drawWin() {
    ctx.font = '50px Arial';
    ctx.fillStyle = '#00ff00';
    ctx.fillText('You Win!', canvas.width / 2 - 130, canvas.height / 2);
    document.getElementById('retryButton').style.display = 'block';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (deathCount < maxDeaths && blockCount > 0) {
        drawBall();
        drawPaddle();
        drawBlocks();
        drawDeathCount();
        if (!collisionDetection()) {
            updateBall();
            requestAnimationFrame(draw);
        }
    } else if (deathCount >= maxDeaths) {
        drawGameOver();
        gameOver = true;
    }
}

function retryGame() {
    blocks = [];
    deathCount = 0;
    blockCount = blockRowCount * blockColumnCount;
    gameOver = false;
    for (let c = 0; c < blockColumnCount; c++) {
        blocks[c] = [];
        for (let r = 0; r < blockRowCount; r++) {
            blocks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    document.getElementById('retryButton').style.display = 'none';
    draw();
}

draw();
