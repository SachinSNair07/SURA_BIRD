var ctx = myCanvas.getContext('2d');
var FPS = 40;
var jump_amount = -10;
var max_fall_speed = +10;
var acceleration = 1;
var pipe_speed = -2;
var game_mode = 'prestart';
var pipes = [];
function MySprite(img_url) {
   this.x = 0;
   this.y = 0;
   this.visible = true;
   this.velocity_x = 0;
   this.velocity_y = 0;
   this.MyImg = new Image();
   this.MyImg.src = img_url || '';
}
MySprite.prototype.Do_Frame_Things = function () {
   ctx.save();
   ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
   ctx.rotate((this.angle * Math.PI) / 180);
   if (this.visible) ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
   this.x += this.velocity_x;
   this.y += this.velocity_y;
   ctx.restore();
};
function Got_Player_Input(MyEvent) {
   switch (game_mode) {
       case 'prestart':
           game_mode = 'running';
           break;
       case 'running':
           bird.velocity_y = jump_amount;
           break;
       case 'over':
           reset_game();
           game_mode = 'running';
           break;
   }
}
addEventListener('touchstart', Got_Player_Input);
addEventListener('mousedown', Got_Player_Input);
addEventListener('keydown', Got_Player_Input);
function reset_game() {
   bird.y = myCanvas.height / 2;
   pipes = [];
}
var bird = new MySprite('http://s2js.com/img/etc/flappybird.png');
bird.x = myCanvas.width / 3;
bird.y = myCanvas.height / 2;
setInterval(function () {
   ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
   bird.Do_Frame_Things();
}, 1000 / FPS);
