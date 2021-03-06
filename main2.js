// setup canvas

const canvas = document.querySelector('canvas');
const para= document.querySelector('p');
const cong =document.getElementById('cong');
const ctx = canvas.getContext('2d');
const but =document.getElementById('but');
const tim =document.getElementById('tim');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
let n=0;


let startTime=0;
let endTime=0;
let timeDiff=0;
let numberBalls = 25;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function end(){
 cong.style.display= "block";
 but.style.display = "block";

 tim.textContent = "Your time was "+ timeDiff.toString(); 
 tim.style.display = "block";

 
 }
// define Ball constructor

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists =exists;
  
}
//Ball inherits
function Ball(x,y,velX,velY,color,size,exists){
Shape.call(this, x, y, velX, velY, exists);
this.color=color;
this.size=size;

}
Ball.prototype =Object.create(Shape.prototype);
Object.defineProperty(Ball.prototype,'constructor',{
  value: Ball,
  enumerable: false,
  writable:true
});

//EvilCircle inherits


function EvilCircle(x,y,exists,color='white',size=10,velX=20,velY=20){

Shape.call(this, x, y, velX, velY, exists);
this.color='white';
this.size=10;
this.velX=20;
this.velY=20;

}



// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;

  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};
//evil draw method

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth=3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};
// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

//Evil check bounds

EvilCircle.prototype.checkBounds = function(){

if((this.x + this.size) >= width) {
    this.x = this.x -this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x = this.x+this.size;
  }

  if((this.y + this.size) >= height) {
    this.y = this.y -this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y = this.y + this.size;
  }



}

//Evil controls

EvilCircle.prototype.setControls =function(){


  let _this = this;
window.onkeydown = function(e) {
    if (e.key === 'a'||e.keyCode == '37') {
      _this.x -= _this.velX;
    } else if (e.key === 'd'|| e.keyCode == '39') {
      _this.x += _this.velX;
    } else if (e.key === 'w' || e.keyCode == '38') {
      _this.y -= _this.velY;
    } else if (e.key === 's'||e.keyCode == '40') {
      _this.y += _this.velY;
    }
  }
}

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j]) && balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};


//Evil collision

EvilCircle.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists=false;
        
        
      }
    }
  }
};
// define array to store balls and populate it

let balls = [];
function make(){
  balls = [];
while(balls.length < numberBalls) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size,
    true
  );
  balls.push(ball);
}
}
make();
let evil =new EvilCircle(
    random(0 +10,width - 10),
    random(0 + 10,height - 10),
    true);
evil.setControls();

//time 


// define loop that keeps drawing the scene constantly




function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists){
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    n=n+1;}

  }
  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  para.textContent = 'Ball Count is ' + n.toString();
  if (n===0 ){
    endTime = new Date();
    if (timeDiff===0){
    timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;}
    end();
  }

n=0;

  requestAnimationFrame(loop);
}


function agaain(){
  cong.style.display= "none";
 but.style.display = "none";
  tim.style.display = "none";
  startTime, endTime,timeDiff =0;
  make();
  startTime = new Date();

 loop();
}
but.addEventListener('click', agaain);

startTime = new Date();
loop();