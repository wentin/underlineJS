/*Created By Wenting Zhang 
javascript color blend mode globalCompositeOperation
*/

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var dist = function(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

var circleCenter = function(x0, y0, x1, y1, x2, y2){
    var dy1 = y1 - y0;
    var dx1 = x1 - x0;
    var dy2 = y2 - y1;
    var dx2 = x2 - x1;

    var aSlope = dy1/dx1;
    var bSlope = dy2/dx2;  

    centerX = (aSlope*bSlope*(y0 - y2) + bSlope*(x0 + x1)
        - aSlope*(x1+x2) )/( 2* (bSlope-aSlope) );
    centerY = -1*(centerX - (x0+x1)/2)/aSlope +  (y0+y1)/2;

    return [centerX, centerY];
}

var drawArc = function(controlX, controlY, ctx){
    var ctx = ctx;
    var controlX = controlX;
    var controlY = controlY;

    var cx = circleCenter(xp0, yp0, controlX, controlY, xp1, yp1)[0];
    var cy = circleCenter(xp0, yp0, controlX, controlY, xp1, yp1)[1];
    var r = dist(cx, cy, xp0, yp0);
    var angle = Math.atan2(cx-xp0, cy-yp0);

    /*if(controlY-yp0 < 1) {
        ctx.beginPath();
        ctx.moveTo(xp0, yp0);
        ctx.lineTo(xp1, yp1);
        ctx.stroke();
    } else {

    }*/

    // console.log(angle);
    if (!angle){
        ctx.beginPath();
        ctx.moveTo(xp0, yp0);
        ctx.lineTo(xp1, yp1);
    } else if( angle > Math.PI/2) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 1.5-angle, Math.PI * 1.5 + angle, true);
    } else {
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 1.5-angle, Math.PI * 1.5 + angle, false);
    }

    // console.log(angle*180/Math.PI);

    ctx.rect(cx, cy, 2, 2);
    ctx.rect(xp0, yp0, 2, 2);
    ctx.rect(xp1, yp1, 2, 2);

    // ctx.fill();
    ctx.stroke();
}
var Point = function (x,y){
    this.x=x;
    this.y=y;
}

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        /**
         * Your drawings need to be inside this function otherwise they will be reset when 
         * you resize the browser window and the canvas goes will be cleared.
         */
         animate();
}
// define global variables
var mouseX, mouseY;

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

xp0 = 300;
yp0 = 100.5;
xp1 = 600;
yp1 = 100.5;

var count = 0;
var lastMouseX;
var lastMouseY;
function animate() {	
	// update
	
	// clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw stuff

	// ctx.moveTo(10, 100.5);
	// ctx.lineTo(1000, 100.5);
	// ctx.stroke();

    var cx = circleCenter(xp0, yp0, mouseX, mouseY, xp1, yp1)[0];
    var cy = circleCenter(xp0, yp0, mouseX, mouseY, xp1, yp1)[1];
    var r = dist(cx, cy, xp0, yp0);

    if( r > 500 && mouseX > xp0 && mouseX < xp1 ){
        
        console.log(r);
        drawArc(mouseX, mouseY, ctx);
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        count = 0;
    } else {
        drawArc(lastMouseX, yp0+(lastMouseY-yp0)*Math.cos(count/10*Math.PI)*Math.pow(0.98, count), ctx);

        count++;
    }


	// request new frame
	requestAnimFrame(function() {
	  animate();
	});
}
animate();
resizeCanvas();

document.onclick = function(e)
{   

	xd = mouseX = e.clientX;
	yd = mouseY = e.clientY;
}

document.onmousemove = function(e)
{
	xd = mouseX = e.clientX;
	yd = mouseY = e.clientY;
}