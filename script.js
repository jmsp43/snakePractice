///////////// GLOBAL VARIABLES ///////////////


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


///// EVENT LISTENER /////

document.addEventListener('keydown', changeDirection)


//////////// FUNCTIONS ///////////////



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

//changes direction of snake
function changeDirection(event) {
  //keys apparently have set key codes
  const left = 37
  const up = 38
  const right = 39
  const down = 40

  //prevents changing direction when you are already doing so
  //made it so i couldn't change direction at all once i did it once when i only added these two lines, but fixed in runGame func
  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  //think of x and y axis
  const goingLeft = dx === -10
  const goingUp = dy === -10
  const goingRight = dx === 10
  const goingDown = dy === 10

  if (keyPressed === left && goingRight === false) {
      dx = -10
      dy = 0
  }
  if (keyPressed === up && goingDown === false) {
      dx = 0
      dy = -10
  }
  if (keyPressed === right && goingLeft === false) {
      dx = 10
      dy = 0
  }
  if (keyPressed === down && goingUp === false) {
      dx = 0
      dy = 10
  }
}

function gameOver() {
  for (let i = 4; i < snake.length; i++){
      //is snake head in same place as any other snake square
      const collision = snake[i].x === snake[0].x && snake[i].y === snake[0].y

    if (collision === true) {
        window.alert('Game over, head collided with body')
          return true
      }
  }


  //did not know why these trailing nums should be there until i played around with them and watched what difference they made
  const hitLeftWall = snake[0].x < 0
      //0 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game

  const hitRightWall = snake[0].x > board.width - 10
  //-10 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game

  const hitTopWall = snake[0].y < 0
    //0 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game
  
  const hitBottomWall = snake[0].y > board.height - 10
    //-10 makes it so you can be right up against the wall but as long as you don't collide, you're still in the game
  
  if (hitLeftWall === true || hitRightWall === true || hitTopWall === true || hitBottomWall === true) {
      window.alert('Game over, collided with wall')
      return true
  } else return false
}


function runGame() {
  if (gameOver()) return

  //this is why my changingDirection check didn't work just in my changeDirection func, needed outside func change, otherwise script was failing to run
  changingDirection = false
  //setTimeout between each movement of snake so user can see what is happening with each movement as opposed to snake just jumping forward
  setTimeout(function timeBtwn() {
    clearBoard();
    moveSnake();
    printSnake();
    runGame();
  }, 500);
}

runGame()
