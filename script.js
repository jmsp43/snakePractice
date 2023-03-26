///////////////////////////////////////////////
///////////// GLOBAL VARIABLES ///////////////
///////////////////////////////////////////////

//make board
const board = document.querySelector(".gameCanvas");
//means the board will be drawn into a 2d space
const boardCtx = board.getContext("2d");

//make snake
let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];
//these are initial coordinates for each square making up the snake
//horizontal body at this point

const boardColor = "#FFC2D4";
const boardBorder = "#602437";
const snakeColor = "#FFE0E9";
const snakeBorder = "#8A2846";

//dx is horizontal change in velocity of snake
let dx = 10;
//dy is vertical change in velocity
let dy = 0;
let score = 0;
let easy = 280;
let medium = 160;
let hard = 80;
let expert = 45;
let changingDirection = false;

let foodX, foodY, foodA, foodB, foodC, foodD, time, obstacleX, obstacleY;

const easyBtn = document.querySelector("#easyBtn");
const medBtn = document.querySelector("#medBtn");
const hardBtn = document.querySelector("#hardBtn");
const expBtn = document.querySelector("#expBtn");
const restartBtn = document.querySelector("#restartBtn");

///////////////////////////////////////////////
///////////////// FUNCTIONS //////////////////
///////////////////////////////////////////////

//to display snake on board, need a func to draw snake and then one that prints snake

//this draws each sqaure that makes up the snake individually
function drawSnake(snakeSquare) {
  boardCtx.fillStyle = snakeColor;
  boardCtx.strokeStyle = snakeBorder;
  boardCtx.fillRect(snakeSquare.x, snakeSquare.y, 10, 10);
  boardCtx.strokeRect(snakeSquare.x, snakeSquare.y, 10, 10);
}
//prints each sqaure drawn by drawSnake() in succession
function printSnake() {
  snake.forEach(drawSnake);
}

//draws blank board with no snake
function clearBoard() {
  boardCtx.fillStyle = boardColor;
  boardCtx.strokeStyle = boardBorder;
  boardCtx.fillRect(0, 0, board.width, board.height);
  boardCtx.strokeRect(0, 0, board.width, board.height);
}

//draws and prints triangles of food
function printFoodTriangles() {
  boardCtx.fillStyle = "#E05780";
  boardCtx.strokeStyle = "#602437";
  boardCtx.beginPath();
  boardCtx.moveTo(foodC + 7, foodD);
  boardCtx.lineTo(foodC, foodD - 7);
  boardCtx.lineTo(foodC - 7, foodD + 7);
  boardCtx.closePath();
  boardCtx.stroke();
  boardCtx.fill();
}

//draws and prints circles of food
function printFoodCircles() {
  boardCtx.fillStyle = "#FF7AA2";
  boardCtx.strokeStyle = "#8A2846";
  boardCtx.beginPath();
  boardCtx.arc(foodX, foodY, 6, 0, 2 * Math.PI);
  boardCtx.stroke();
  boardCtx.fill();
}

//draws and prints squares of food
function printFoodSquares() {
  boardCtx.fillStyle = "#B9375E";
  boardCtx.strokeStyle = "#8A2846";
  boardCtx.fillRect(foodA, foodB, 10, 10);
  boardCtx.strokeRect(foodA, foodB, 10, 10);
}

//should draw and print an obstacle, but currently isn't doing it
function printObstacles() {
  boardCtx.fillStyle = "black";
  boardCtx.strokeStyle = "chartreuse";
  boardCtx.fillRect(obstacleX, obstacleY, 20, 20);
  boardCtx.strokeRect(obstacleX, obstacleY, 20, 20);
}

//random probabality of food
function randomFood(min, max) {
  return Math.round((Math.random() * (max - min + min)) / 10) * 10;
}

//random probability of obstacle
function randomObstacle(min, max) {
  return Math.round((Math.random() * (max - min + min)) / 10) * 10;
}

//checks if any of the snakes squares touch any food circles
function snakeAte(snakeSquare) {
  //wasn't working before bc i had a strict equals operator
  const ate =
    snakeSquare.x == (foodX || foodA || foodC) &&
    snakeSquare.y == (foodY || foodB || foodD);
  if (ate === true) {
    generateFood;
  }
}

//generates food at random spots
function generateFood() {
  foodX = randomFood(0, board.width - 10);
  foodY = randomFood(0, board.height - 10);
  foodA = randomFood(0, board.width - 10);
  foodB = randomFood(0, board.height - 10);
  foodC = randomFood(0, board.width - 10);
  foodD = randomFood(0, board.height - 10);
  snake.forEach(snakeAte);
}

//should generate obstacle at random spot but currently doesn't work and if snake hits obstacle then game should end
function generateObstacles() {
  obstacleX = randomObstacle(0, board.width - 20);
  obstacleY = randomObstacle(0, board.height - 20);
  const hitObstacle = snakeSquare.x == obstacleX && snakeSquare.y == obstacleY;
  if (hitObstacle === true) {
    gameOver();
  }
}

//updates position of the snake
function moveSnake() {
  //create new head in new coordinate
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  //puts new head at position in front of rest of body
  snake.unshift(head);

  const eatenCircle = snake[0].x == foodX && snake[0].y == foodY;

  //me trying to fix the gameplay issue that causes player to have to hit the lower right side part of the circle for it to count, doesn't work yet
  // const eatenCircle = (snake[0].x == foodX && snake[0].y == foodY)|| (snake[0].x == foodX-3 && snake[0].y == foodY+3) || (snake[0].x == foodX-4 && snake[0].y == foodY+4) || (snake[0].x == foodX-6 && snake[0].y == foodY+6) || (snake[0].x == foodX-6 && snake[0].y == foodY+6) || (snake[0].x == foodX-5 && snake[0].y == foodY+5)||(snake[0].x == foodX-7 && snake[0].y == foodY+7) || (snake[0].x == foodX-8 && snake[0].y == foodY+8)

  const eatenSquare = snake[0].x == foodA && snake[0].y == foodB;
  const eatenTriangle = snake[0].x == foodC && snake[0].y == foodD;

  //me trying to fix the gameplay issue that causes player to have to hit the right most corner of the triangle for it to count, doesn't work yet
  //  const eatenTriangle = (snake[0].x == foodC && snake[0].y == foodD) || (snake[0].x == foodC -7 && snake[0].y == foodD) || (snake[0].x == foodC && snake[0].y == foodD - 7)

  //different food types worth different amounts of points
  if (eatenCircle === true || eatenSquare === true || eatenTriangle === true) {
    if (eatenCircle === true) {
      score += 30;
      document.querySelector(".score").innerHTML = `Score: ${score}`;
      document.querySelector(
        ".snakeSize"
      ).innerHTML = `Snake is now ${snake.length} units long`;
      //make new food somewhere else
      generateFood();
    }

    if (eatenSquare === true) {
      score += 10;
      document.querySelector(".score").innerHTML = `Score: ${score}`;
      document.querySelector(
        ".snakeSize"
      ).innerHTML = `Snake is now ${snake.length} units long`;
      //make new food somewhere else
      generateFood();
    }
    if (eatenTriangle === true) {
      score += 20;
      document.querySelector(".score").innerHTML = `Score: ${score}`;
      document.querySelector(
        ".snakeSize"
      ).innerHTML = `Snake is now ${snake.length} units long`;
      //make new food somewhere else
      generateFood();
    }
  } else {
    //pop off last snake square
    snake.pop();
  }
}
//snake moves 1 step to right (by 10px), increase x coordinate of every part of the snake by 10px (aka dx = +10)
//snake moves 1 step to left (by 10px), decrease y coordinate of every part of the snake by 10px (aka dx = -10)

//changes direction of snake
function changeDirection(event) {
  //keys apparently have set key codes
  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;

  //prevents changing direction when you are already doing so
  //made it so i couldn't change direction at all once i did it once when i only added these two lines, but fixed in runGame func
  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  //think of x and y axis
  const goingLeft = dx === -10;
  const goingUp = dy === -10;
  const goingRight = dx === 10;
  const goingDown = dy === 10;

  //moves snake according to what arrow is pressed and ensures you cannot go backwards
  if (keyPressed === left && goingRight === false) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === up && goingDown === false) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === right && goingLeft === false) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === down && goingUp === false) {
    dx = 0;
    dy = 10;
  }
}

function gameOver() {
  for (let i = 4; i < snake.length; i++) {
    //is snake head in same place as any other snake square
    const collision = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

    if (collision === true) {
      document.querySelector(".gameEnded").innerHTML =
        "Game over, head collided with body";
      return true;
    }
  }

  //did not know why these trailing nums should be there until i played around with them and watched what difference they made
  const hitLeftWall = snake[0].x < 0;
  //0 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game

  const hitRightWall = snake[0].x > board.width - 10;
  //-10 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game

  const hitTopWall = snake[0].y < 0;
  //0 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game

  const hitBottomWall = snake[0].y > board.height - 10;
  //-10 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game

  if (
    hitLeftWall === true ||
    hitRightWall === true ||
    hitTopWall === true ||
    hitBottomWall === true
  ) {
    document.querySelector(".gameEnded").innerHTML =
      "Game over, head collided with wall";
    return true;
  } else return false;
}

function runGame() {
  if (gameOver()) return;

  //this is why my changingDirection check didn't work just in my changeDirection func, needed outside func change, otherwise script was failing to run
  changingDirection = false;
  //setTimeout between each movement of snake so user can see what is happening with each movement as opposed to snake just jumping forward
  setTimeout(function timeBtwn() {
    clearBoard();
    printSnake();
    printFoodCircles();
    printFoodSquares();
    printFoodTriangles();
    printObstacles();
    moveSnake();
    runGame();
  }, time);
}

///////////////////////////////////////////////
/////////////// EVENT LISTENERS ///////////////
///////////////////////////////////////////////

//change direction upon pressing key
document.addEventListener("keydown", changeDirection);

//buttons to choose for mode player wants
easyBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modeButtons").style.visibility = "hidden";
  generateFood();
  // generateObstacles();
  time = easy;
  runGame();
});

medBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modeButtons").style.visibility = "hidden";
  generateFood();
  // generateObstacles();
  time = medium;
  runGame();
});

hardBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modeButtons").style.visibility = "hidden";
  generateFood();
  //generateObstacles();
  time = hard;
  runGame();
});

expBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modeButtons").style.visibility = "hidden";
  generateFood();
  // generateObstacles();
  time = expert;
  runGame();
});

restartBtn.addEventListener("click", function (event) {
  event.preventDefault();
  location.reload();
});
