/*Created By Wenting Zhang 
About Javascript Random Seed function study
Javascript Math.random() don't have random seed functionality
using http://davidbau.com/encode/seedrandom-min.js makes Math.random() seedable

javascript color blend mode globalCompositeOperation
*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var dist = function(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

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
// current position and original position
var xp0, yp0, ypt0;
var xp1, yp1, ypt1;
// store distance
var dx, dy;
// array of current start/end points
// PVector pt0, pt1;
// store original position
// PVector pto0, pto1;

// my permanent midpoint
var xMid, yMid;		
// the position of my swinging pendulum povar (midpoint)
var xc, yc;
// my grabbed povar by user
var xg, yg, xgi, ygi;
var xg1, yg1, xg0, yg0;
// drawing point
var xd, yd;
// ratio for curvature. Make this around 0.5 or higher
var rBezier = 0.2;
// distance we can pull perpendicularly from middle pt of string (as ratio length)
// (amplitude of wave)
var rDistMax = 0.15;
// minimum distance to force string to move, when you brush it
var rDistMin = 0.01;
// max amplitude of wave when oscillating (as ratio of length)
var rAmpMax = 0.072;
// minimum distance to move (px), amplitude, so if you brush it it always shows movement
var ampPxMin = 5;
// maximum pixel distance to move, amplitude
var ampPxMax = 33;
// pan range (-1 to 1) - range is -1 to 1, but make it slight because 
// it will shift already playing sounds
var pan0 = -0.4; var pan1 = 0.4;
// frequency of oscillation - this is the increment per frame for t value.
// higher gives higher frequency
var freq0 = 0.5; // frequency for long strings
var freq1 = 2.5; // frequency for short strings
var freq;

// amplitude dampening - how quickly it dampens to nothing - ratio 0 to 1
var ampDamp0 = 0.95;
var ampDamp1 = 0.87;
var ampDamp;
// length where we cap it highest/lowest pitch (px)
// our longest thread is 658, shortest is 19
var len0 = 30; var len1 = 480;
// temporary distance variables
var distMax; var distPerp;
// how close do we have to be to instantly grab a thread - perpendicular distance (px)
var distInstantPerp = 6;  

// stores ratio from 0 to 1 where user has grabbed along the string
var rGrab, rHalf;
// my main angle
var ang; var angOrig;
// my perpendicular angle
var angPerp;
// total length of this thread (when unstretched)
var len; var lenOrig;
// how much are we stretched, as a ratio from 0 (straight line) to 1 (max elastic)
var rStretch = 0;
// easing resize ratio
var resizeEase = 0.08;


// temporary variables
var dx0, dy0, dx1, dy1, dist0, dist1;
var dxBez0, dyBez0, dxBez1, dyBez1;

// my index number within the route sequence
var ind;
// stroke
var str0 = 1; var str1 = 4; var str;
// hex value
var hex;

// frame counter
var ctGrab = 0;
// oscillation increment
var t = 0;
// current amplitude
var amp, ampMax;
// current stretch strength as ratio
var rStrength;

// my pitch index (0, 1, 2...) - and as ratio
var pitchInd; var rPitch;
// reference to my audio sample
// AudioSample au;
// lowest and highest volume for notes triggered by user
var vol0 = 0.3; var vol1 = 0.6;
// gain range triggered by user (db change)
var gain0 = -10; var gain1 = -1;
// is update on
var isUpdOn = false;
// oscillation direction (-1 or 1)
var oscDir;

// currently grabbed
var isGrabbed = false;
// currently oscillating
var isOsc = false;
// was just dropped
var isFirstOsc = false;
// not drawn yet
var isVisible = false; 
//
var isFirstRun = true;
// is resizing
var isResizing = false;



window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

xp0 = 10;
yp0 = 300.5;
xp1 = 500;
yp1 = 300.5;

    dx = xp1-xp0;
    dy = yp1-yp0;
    // store angle
    ang = Math.atan2(dy, dx);

function animate() {	
	// update
	
	// clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw stuff

	// ctx.moveTo(10, 100.5);
	// ctx.lineTo(1000, 100.5);
	// ctx.stroke();


	// if (isGrabbed || isFirstOsc) {
 //      xd = xg; yd = yg;
 //    // oscillating freely mode
 //    } else {
 //      xd = xc; yd = yc;
 //    }
    dx0 = xd-xp0; dy0 = yd-yp0;
    dx1 = xp1-xd; dy1 = yp1-yd;
    // distance
    dist0 = dist(xp0, yp0, xd, yd);
    dist1 = dist(xd, yd, xp1, yp1);
    // move to the center pendulum point
    dxBez0 = rBezier*dist0*Math.cos(ang);
    dyBez0 = rBezier*dist0*Math.sin(ang);		
    // move to the center pendulum point
    dxBez1 = rBezier*dist1*Math.cos(ang);
    dyBez1 = rBezier*dist1*Math.sin(ang);			
    // draw bezier - point, control, control, point

    ctx.beginPath();
    ctx.moveTo(xp0, yp0);
    ctx.bezierCurveTo(xd-dxBez0, yd-dyBez0, xd-dxBez0, yd-dyBez0, xd, yd);
    ctx.bezierCurveTo(xd+dxBez1, yd+dyBez1, xd+dxBez1, yd+dyBez1, xp1, yp1);
    // bezier(xp0, yp0, xd-dxBez0, yd-dyBez0, xd-dxBez0, yd-dyBez0, xd, yd);
    // bezier(xd, yd, xd+dxBez1, yd+dyBez1, xd+dxBez1, yd+dyBez1, xp1, yp1);
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.rect(xp0, yp0, 2, 2);
    ctx.rect(xd, yd, 2, 2);
    ctx.rect(xd-dxBez0, yd-dyBez0, 2, 2);
    ctx.rect(xd+dxBez1, yd+dyBez1, 2, 2);
    ctx.rect(xp1, yp1, 2, 2);
    ctx.fill();

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