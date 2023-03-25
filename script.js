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

//updates position of the snake
function moveSnake() {
  //create new head in new coordinate
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  //puts new head at position in front of rest of body
  snake.unshift(head);
  //pops off last snake square
  snake.pop();
}
//snake moves 1 step to right (by 10px), increase x coordinate of every part of the snake by 10px (aka dx = +10)
//snake moves 1 step to left (by 10px), decrease y coordinate of every part of the snake by 10px (aka dx = -10)

function runGame() {
  //setTimeout between each movement of snake so user can see what is happening with each movement as opposed to snake just jumping forward
  setTimeout(function timeBtwn() {
    clearBoard();
    moveSnake();
    printSnake();
    runGame();
  }, 500);
}

runGame()
