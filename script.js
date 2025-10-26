$(function(){
  const canvas = $('#Canvas');
  const bird = $('#Birdy');
  const pauseBtn = $('#PauseButton');
  const resetBtn = $('#ResetButton');
  const scoreEl = $('#CurrentScore');
  const finalEl = $('#FinalScore');
  const bestEl = $('#BestScore');
  const lostScreen = $('#LostScoreScreen');

  let paused = false, lost = false, score = 0, velocity = 0, gravity = 0.3, lift = -6;
  let gameLoop;

  function startGame() {
    resetGame();
    createPipe();
    gameLoop = setInterval(loop, 30);
  }

  function resetGame() {
    clearInterval(gameLoop);
    $('.Pipe').remove();
    lost = false;
    paused = false;
    velocity = 0;
    score = 0;
    scoreEl.text(score);
    bird.css({top: '50%', transform: 'rotate(0deg)'});
    lostScreen.hide();
  }

  function createPipe() {
    if (lost) return;
    const gap = 28;
    const minHeight = 10;
    const topHeight = Math.random() * (70 - gap - minHeight) + minHeight;
    const bottomTop = topHeight + gap;
    const bottomHeight = 100 - bottomTop;

    $('<div/>').addClass('Pipe').css('height', topHeight + '%').appendTo(canvas);
    $('<div/>').addClass('Pipe').css({height: bottomHeight + '%', top: bottomTop + '%'}).appendTo(canvas);
  }

  function fall() {
    if (paused || lost) return;
    velocity += gravity;
    let newTop = bird.position().top + velocity;
    if (newTop < 0) newTop = 0;
    if (newTop + bird.height() > canvas.height()) endGame();
    bird.css('top', newTop + 'px');
  }

  function jump() {
    if (paused || lost) return;
    velocity = lift;
  }

  function checkCollisions() {
    $('.Pipe').each(function() {
      const pipe = $(this);
      const b = bird[0].getBoundingClientRect();
      const p = pipe[0].getBoundingClientRect();
      if (!(b.right < p.left || b.left > p.right || b.bottom < p.top || b.top > p.bottom)) {
        endGame();
      }
    });
  }

  function incrementScore() {
    $('.Pipe').each(function() {
      const pipe = $(this);
      if (!pipe.data('scored') && pipe.position().left + pipe.width() < bird.position().left) {
        score++;
        pipe.data('scored', true);
        scoreEl.text(score);
      }
    });
  }

  function loop() {
    if (paused || lost) return;
    fall();
    checkCollisions();
    incrementScore();
  }

  function endGame() {
    lost = true;
    clearInterval(gameLoop);
    $('.Pipe').addClass('paused');
    lostScreen.show();
    finalEl.text(score);
    let best = localStorage.getItem('best') || 0;
    if (score > best) {
      best = score;
      localStorage.setItem('best', best);
    }
    bestEl.text(best);
  }

  pauseBtn.on('click', function(e){
    e.stopPropagation();
    paused = !paused;
    $(this).text(paused ? '▶️' : '⏸️');
  });

  resetBtn.on('click', startGame);
  canvas.on('mousedown touchstart', jump);
  $(document).on('keydown', e => {
    if (e.which === 32) jump();
    if (e.which === 80) paused = !paused;
  });

  setInterval(() => {
    if (!paused && !lost) createPipe();
  }, 2200);

  startGame();
});
