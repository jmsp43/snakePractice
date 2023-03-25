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

const boardColor = "indianred";
const boardBorder = "black";
const snakeColor = "darkblue";
const snakeBorder = "lightblue";

//dx is horizontal change in velocity of snake
let dx = 10;
//dy is vertical change in velocity
let dy = 0;

let changingDirection = false;

let foodX, foodY, foodA, foodB;

let score = 0;

let easy = 280;
let medium = 160;
let hard = 80;
let expert = 45;

let time = 500;

const easyBtn = document.querySelector("#easyBtn");
const medBtn = document.querySelector("#medBtn");
const hardBtn = document.querySelector("#hardBtn");
const expBtn = document.querySelector("#expBtn");

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

//draws and prints circles of food
function printFoodCircles() {
  boardCtx.fillStyle = "lightgreen";
  boardCtx.strokeStyle = "darkgreen";
  boardCtx.beginPath();
  boardCtx.arc(foodX, foodY, 7, 0, 2 * Math.PI);
  boardCtx.stroke();
  boardCtx.fill();
}

function printFoodSquares() {
  boardCtx.fillStyle = "orange";
  boardCtx.strokeStyle = "purple";
  boardCtx.fillRect(foodA, foodB, 10, 10);
  boardCtx.strokeRect(foodA, foodB, 10, 10);
}

//random probabality of food
function randomFood(min, max) {
  return Math.round((Math.random() * (max - min + min)) / 10) * 10;
}

//checks if any of the snakes squares touch any food circles
function snakeAte(snakeSquare) {
  //wasn't working before bc i had a strict equals operator
  const ate =
    snakeSquare.x == (foodX || foodA) && snakeSquare.y == (foodY || foodB);
  if (ate === true) {
    generateFood;
  }
}

function generateFood() {
  foodX = randomFood(0, board.width - 10);
  foodY = randomFood(0, board.height - 10);
  foodA = randomFood(0, board.width - 10);
  foodB = randomFood(0, board.height - 10);
  snake.forEach(snakeAte);
}

//updates position of the snake
function moveSnake() {
  //create new head in new coordinate
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  //puts new head at position in front of rest of body
  snake.unshift(head);

  const eatenCircle = snake[0].x == foodX && snake[0].y == foodY;
  const eatenSquare = snake[0].x == foodA && snake[0].y == foodB;


  if (eatenCircle === true || eatenSquare === true) {
    if (eatenCircle === true) {
      score += 10;
      document.querySelector(".score").innerHTML = `Score: ${score}`;
      document.querySelector(
        ".snakeSize"
      ).innerHTML = `Snake is now ${snake.length} units long`;
      //make new food somewhere else
      generateFood();
    }

    if (eatenSquare === true) {
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
    moveSnake();
    runGame();
  }, time);
}

///////////////////////////////////////////////
/////////////// EVENT LISTENERS ///////////////
///////////////////////////////////////////////

document.addEventListener("keydown", changeDirection);

easyBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".buttons").style.visibility = "hidden";
  generateFood();
  time = easy;
  runGame();
});

medBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".buttons").style.visibility = "hidden";
  generateFood();
  time = medium;
  runGame();
});

hardBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".buttons").style.visibility = "hidden";
  generateFood();
  time = hard;
  runGame();
});

expBtn.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".buttons").style.visibility = "hidden";
  generateFood();
  time = expert;
  runGame();
});
