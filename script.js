const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");

const W = canvas.width;
const H = canvas.height;

// Bird setup
const bird = {
  x: 100,
  y: H / 2,
  radius: 15,
  velocity: 0,
  gravity: 0.5,
  jump: -8
};

// Game variables
let pipes = [];
let frame = 0;
let gameOver = false;
let score = 0;
let best = 0;

// Reset game
function resetGame() {
  bird.y = H / 2;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  scoreDisplay.textContent = score;
  gameOver = false;
}

// Create pipes
function createPipe() {
  const topHeight = Math.floor(Math.random() * (H / 2)) + 50;
  const gap = 150;
  pipes.push({ x: W, top: topHeight, bottom: topHeight + gap });
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, W, H);

  // Draw pipes
  ctx.fillStyle = "#228B22";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 60, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, 60, H - pipe.bottom);
  });

  // Draw bird
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcc00";
  ctx.fill();
  ctx.stroke();

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Poppins";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Update game
function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 100 === 0) createPipe();

  pipes.forEach(pipe => {
    pipe.x -= 3;

    // Collision
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + 60 &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
    ) {
      gameOver = true;
      best = Math.max(best, score);
      alert(`Game Over!\nScore: ${score}\nBest: ${best}`);
      resetGame();
    }

    if (pipe.x + 60 === bird.x) {
      score++;
      scoreDisplay.textContent = score;
    }
  });

  // Ground/ceiling collision
  if (bird.y + bird.radius > H || bird.y - bird.radius < 0) {
    gameOver = true;
    best = Math.max(best, score);
    alert(`Game Over!\nScore: ${score}\nBest: ${best}`);
    resetGame();
  }

  frame++;
}

// Loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") bird.velocity = bird.jump;
});
canvas.addEventListener("click", () => (bird.velocity = bird.jump));
startBtn.addEventListener("click", resetGame);

// Start game
resetGame();
loop();
