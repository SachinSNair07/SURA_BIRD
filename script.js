const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = { x: 80, y: 300, width: 30, height: 30, gravity: 0.3, lift: -6, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Jump / flap
function flap() {
  if (!gameOver) bird.velocity = bird.lift;
  else restartGame();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") flap();
});
canvas.addEventListener("click", flap);

function restartGame() {
  bird.y = 300;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  loop();
}

function createPipe() {
  const gap = 140; // space between pipes
  const topHeight = Math.random() * 250 + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 60
  });
}

function drawBird() {
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = "#228B22";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 120 === 0) createPipe();

  pipes.forEach((pipe) => {
    pipe.x -= 2.5; // slower speed for smoother gameplay
  });

  // Remove old pipes
  if (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
    score++;
  }

  // Collision detection
  pipes.forEach((pipe) => {
    if (
      bird.x + bird.width / 2 > pipe.x &&
      bird.x - bird.width / 2 < pipe.x + pipe.width &&
      (bird.y - bird.height / 2 < pipe.top || bird.y + bird.height / 2 > pipe.bottom)
    ) {
      gameOver = true;
    }
  });

  if (bird.y + bird.height / 2 > canvas.height || bird.y - bird.height / 2 < 0) {
    gameOver = true;
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Poppins";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function loop() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "28px Poppins";
    ctx.fillText("Game Over!", 120, 280);
    ctx.fillText("Click or Press Space to Restart", 45, 320);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
  update();

  frame++;
  requestAnimationFrame(loop);
}

loop();
