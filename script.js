const bird = document.getElementById('bird');
const GRAVITY = 2;
const JUMP = -30;
let birdY = 250;
 
document.addEventListener('click', function () {
    birdY += JUMP;
    bird.style.top = birdY + 'px';
});
 
function fall() {
    birdY += GRAVITY;
    bird.style.top = birdY + 'px';
}
 
setInterval(fall, 20);
 
function generatePipes() {
    let pipe = document.createElement('div');
    pipe.classList.add('pipe');
    let randomHeight = Math.floor(Math.random() * 200) + 100;
    pipe.style.height = randomHeight + 'px';
    pipe.style.left = '400px';
    document.getElementById('gameArea').appendChild(pipe);
}
 
setInterval(generatePipes, 3000);
 
function movePipes() {
    const pipes = document.querySelectorAll('.pipe');
    pipes.forEach(function (pipe) {
        let pipeX = parseInt(getComputedStyle(pipe).left);
        pipeX -= 2;
        pipe.style.left = pipeX + 'px';
    });
}
 
setInterval(movePipes, 20);
 
function checkCollision() {
    let birdRect = bird.getBoundingClientRect();
    const pipes = document.querySelectorAll('.pipe');
    pipes.forEach(function (pipe) {
        let pipeRect = pipe.getBoundingClientRect();
        if (birdRect.left < pipeRect.right &&
            birdRect.right > pipeRect.left &&
            birdRect.top < pipeRect.bottom &&
            birdRect.bottom > pipeRect.top) {
            alert('Game Over!');
        }
    });
}
 
setInterval(checkCollision, 20);
