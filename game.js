/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

let bgReady, heroReady, monsterReady,obstacleReady;
let bgImage, heroImage, monsterImage,obstacleImage;
let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
let monsterX = 100;
let monsterY = 100;
let obstacleX = randomPosition(500);
let obstacleY = randomPosition(500);

let startTime = Date.now();
let SECONDS_PER_ROUND = 20;
let elapsedTime = 0;
let count=0;
let highscore = 0;
let timer;
let keysDown = {};

let obstacleDirectionX = 1;
let obstacleDirectionY = 1;

let herocaughtObstacle=false;
let coinSound;
let loseSound;


function randomPosition(num) {
  return Math.floor(Math.random() * num);
}

// sound

coinSound = new Audio("/audio/jump.wav");
loseSound = new Audio("/audio/gameover.wav");

var audio = document.getElementById("audio");
var isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    audio.pause()
  } else {
    audio.play();
  }
};
audio.onplaying = function() {
  isPlaying = true;
};
audio.onpause = function() {
  isPlaying = false;
};



function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "http://copie-copains-club.net/wp-content/uploads/2013/06/clouds.jpg";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero1.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/coin.png";

  obstacleImage = new Image();
  obstacleImage.onload = function () {
    obstacleReady = true;
  };
  obstacleImage.src = "images/obstacle.png";
}


function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}




let update = function () {
 
  const isOutOfTime = SECONDS_PER_ROUND - elapsedTime <= 0;
  herocaughtMonster(); 
    if (isOutOfTime) {
      gameOver();
      return;
    }
    if(herocaughtObstacle){
      gameOver();
      return;
    }
    
      move(); //플레이어 움직임
      screenoff(); //스크린밖으로 나가면 다시 돌아옴
      // herocaughtMonster(); //몬스터 
      checkCollision();

      
  }


  function restartGame() {
    
    document.getElementById("highscore").innerHTML = `${highscore}`
    count=0;
    document.getElementById("count").innerHTML = `${count}`

    startTime = Date.now();
    SECONDS_PER_ROUND = 21;
    elapsedTime = 0;
    timer;

    keysDown = {};
    heroX = canvas.width / 2;
    heroY = canvas.height / 2;
    monsterX = 100;
    monsterY = 100;
    obstacleX = randomPosition(500);
    obstacleY = randomPosition(500);
  }


function screenoff() {
      if (heroX<=0) {
          heroX = canvas.width - 30;
      }
      if (heroX >= canvas.width){
          heroX=0;
      }
      if (heroY<=0) {
        heroY = canvas.width - 30;
    }
    if (heroY >= canvas.width){
        heroY=0;
    }
  }


function upScore() {

  count += 1;

  monsterX = randomPosition(550)
  monsterY =  randomPosition(550)

  document.getElementById("count").innerHTML =`${count}`;
  
  if (highscore < count) {
    highscore = count;
    document.getElementById("highscore").innerHTML = `${highscore}`;
}
}


function checkCollision() {
   herocaughtObstacle =
    heroX <= (obstacleX + 30)
  && obstacleX <= (heroX + 30)
  && heroY <= (obstacleY + 30)
  && obstacleY <= (heroY + 30);
  if(herocaughtObstacle) {
    
    gameOver();
    
    obstacleX = randomPosition(500)
    obstacleY = randomPosition(500)

  }
}


function herocaughtMonster() {
    const herocaughtMonster =
    heroX <= (monsterX + 50)
  && monsterX <= (heroX + 50)
  && heroY <= (monsterY + 50)
  && monsterY <= (heroY + 50);
  if (herocaughtMonster) {
        upScore();
        coinSound.play();
    }
  
};

function move() {
  if (38 in keysDown) { // Player is holding up key
      heroY -= 5;
    }
    if (40 in keysDown) { // Player is holding down key
      heroY += 5;
    }
    if (37 in keysDown) { // Player is holding left key
      heroX -= 5;
    }
    if (39 in keysDown) { // Player is holding right key
      heroX += 5;
    }

}

function checkIfOutOfTime(isOutOfTime) {
    console.log('checkIfOutOfTime')
    if (isOutOfTime) {
      gameOver();
      return;
    }
  }


function stopClock() {
    clearInterval(timer);
  }


timer = setInterval(() => {
    elapsedTime += 1;
    document.getElementById("timer").innerHTML = `${SECONDS_PER_ROUND - elapsedTime}`;
  }, 1000);



var render = function () {

  obstacleX += obstacleDirectionX * 4;
  obstacleY += obstacleDirectionY * 4;

  if (obstacleX > canvas.width - 50 || obstacleX < 0) {
  obstacleDirectionX = -obstacleDirectionX;
  }

  if (obstacleY > canvas.height - 50 || obstacleY < 0) {
  obstacleDirectionY = -obstacleDirectionY;
  }

  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  
  if (obstacleReady) {
    ctx.drawImage (obstacleImage, obstacleX, obstacleY);
  }

  const isOutOfTime = SECONDS_PER_ROUND - elapsedTime <= 0;
  herocaughtMonster();
  if (isOutOfTime||herocaughtObstacle) {
    ctx.fontsize = "50px";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(` GAME OVER!!!`, 300, 30);
  }
};


function gameOver() {
  clearInterval(timer);
  isOutOfTime = true;
}

var main = function () {

  update(); 
  render();
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();