//board
let board;
let boardWidth;
let boardHeight;
let context;

//players
let playerWidth;
let playerHeight;
let playerVelocityY = 0;

let player1 = {
    x : 0,
    y : 0,
    width: 0,
    height: 0,
    velocityY : 0
}

let player2 = {
    x : 0,
    y : 0,
    width: 0,
    height: 0,
    velocityY : 0
}

//ball
let ballWidth;
let ballHeight;
let ball = {
    x : 0,
    y : 0,
    width: 0,
    height: 0,
    velocityX : 1,
    velocityY : 2
}

let player1Score = 0;
let player2Score = 0;

// Initialize dimensions based on window size
function initializeDimensions() {
    boardWidth = window.innerWidth;
    boardHeight = window.innerHeight;
    
    // Scale player dimensions based on screen size
    playerWidth = Math.floor(boardWidth * 0.02); // 2% of screen width
    playerHeight = Math.floor(boardHeight * 0.15); // 15% of screen height
    
    // Scale ball dimensions
    ballWidth = Math.floor(boardWidth * 0.015);
    ballHeight = ballWidth;
    
    // Update player positions
    player1.width = playerWidth;
    player1.height = playerHeight;
    player1.x = boardWidth * 0.05;
    player1.y = boardHeight/2 - playerHeight/2;
    
    player2.width = playerWidth;
    player2.height = playerHeight;
    player2.x = boardWidth - playerWidth - (boardWidth * 0.05);
    player2.y = boardHeight/2 - playerHeight/2;
    
    // Update ball position
    ball = {
        x : boardWidth/2 - ballWidth/2,
        y : boardHeight/2 - ballHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : boardWidth * 0.003, // Scale velocity with screen size
        velocityY : boardHeight * 0.004
    }
}

window.onload = function() {
    board = document.getElementById("board");
    context = board.getContext("2d");
    
    initializeDimensions();
    board.width = boardWidth;
    board.height = boardHeight;
    
    requestAnimationFrame(update);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    window.addEventListener("resize", handleResize);
}

function handleResize() {
    initializeDimensions();
    board.width = boardWidth;
    board.height = boardHeight;
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // player1
    context.fillStyle = "skyblue";
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    // player2
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

    if (ball.y <= 0 || (ball.y + ballHeight >= boardHeight)) { 
        ball.velocityY *= -1;
    }

    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.velocityX = Math.abs(ball.velocityX);   
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) { 
            ball.velocityX = -Math.abs(ball.velocityX);   
        }
    }

    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    }
    else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame(-1);
    }

    // Scale font size based on screen size
    let fontSize = Math.floor(boardHeight * 0.09);
    context.font = `${fontSize}px sans-serif`;
    context.fillText(player1Score, boardWidth/5, fontSize);
    context.fillText(player2Score, boardWidth*4/5 - fontSize, fontSize);

    // Draw center line
    for (let i = 10; i < board.height; i += boardHeight/20) {
        context.fillRect(board.width/2 - playerWidth/2, i, playerWidth/2, boardHeight/50);
    }
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function keyDown(e) {
    let playerSpeed = boardHeight * 0.01; // Scale speed with screen height
    
    if (e.code == "KeyW") {
        player1.velocityY = -playerSpeed;
    }
    else if (e.code == "KeyS") {
        player1.velocityY = playerSpeed;
    }

    if (e.code == "ArrowUp") {
        player2.velocityY = -playerSpeed;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = playerSpeed;
    }
}

function keyUp(e) {
    if (e.code == "KeyW" || e.code == "KeyS") {
        player1.velocityY = 0;
    }
    
    if (e.code == "ArrowUp" || e.code == "ArrowDown") {
        player2.velocityY = 0;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame(direction) {
    ball = {
        x : boardWidth/2 - ballWidth/2,
        y : boardHeight/2 - ballHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction * (boardWidth * 0.003),
        velocityY : boardHeight * 0.004
    }
}