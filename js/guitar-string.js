var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;


var circleCenter = function(startPoint, thirdPoint, endPoint){
    var dy1 = thirdPoint.y - startPoint.y;
    var dx1 = thirdPoint.x - startPoint.x;
    var dy2 = endPoint.y - thirdPoint.y;
    var dx2 = endPoint.x - thirdPoint.x;

    var aSlope = dy1/dx1;
    var bSlope = dy2/dx2;  


    var centerX = (aSlope*bSlope*(startPoint.y - endPoint.y) + bSlope*(startPoint.x + thirdPoint.x)
        - aSlope*(thirdPoint.x+endPoint.x) )/( 2* (bSlope-aSlope) );
    var centerY = -1*(centerX - (startPoint.x+thirdPoint.x)/2)/aSlope +  (startPoint.y+thirdPoint.y)/2;
    var r = dist(centerX, centerY, startPoint.x, startPoint.y)

    return {
        x: centerX,
        y: centerY,
        r: r
    };
}

var dist = function(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

var Point = function (x,y){
    this.x=x;
    this.y=y;
}


var intersects = function(a, b, c, d, p, q, r, s) {
    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;                    
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

var musicLevel = function(startPoint, endPoint, ratio){
    var length = dist(startPoint.x, startPoint.y, endPoint.x, endPoint.y)/ratio;

    level = Math.floor(length/30);
    if (level > 19 ) {
        level = 19;
    }
    level = 19 - level 
    if (level < 10) {
        level = '0' + level 
    }
    return level;
};
function GuitarString(ctx, startPoint, endPoint, strokeWidth, strokeColor, ratio) {
	//ctor
    this.ctx = ctx;
    this.canvas = ctx.canvas;
	this.startPoint = startPoint;
	this.endPoint = endPoint;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.ratio = ratio;

    this.level = musicLevel(this.startPoint, this.endPoint, this.ratio);

    // this.canvas.width = this.canvas.clientWidth;
    // this.canvas.height = this.canvas.clientHeight*1.2;
    
    this.maxGrabDistance = this.strokeWidth * 2;
    this.maxControlDistance = this.strokeWidth * 6;

    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.strokeStyle = this.strokeColor;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.stroke();

    this.currentMouseX;
    this.currentMouseY;
    this.lastMouseX;
    this.lastMouseY;
    this.waveInitX = (this.startPoint.x + this.endPoint.x)/2;
    this.waveInitY = this.startPoint.y - this.maxControlDistance;
    this.waveCount = 0;
    this.damping = 0.9;

	this.thirdPoint = new Point((this.startPoint.x + this.endPoint.x)/2, this.startPoint.y);
    

    // state flags
	this.userInControl = false;
	this.userPlucked = false;
	this.waveInControl = false;
	this.waveFinished = false;
	this.initState = true;
    this.lastRedraw = false;
    this.redrawActive = false;

    //add event listener
	var self = this;
    this.canvas.addEventListener('mouseover',  function(event) { 
        self.mouseOver(self, event);
    }, false);

	this.canvas.addEventListener('mousemove',  function(event) { 
		self.mouseMove(self, event);
	}, false);

    this.canvas.addEventListener ("mouseleave", function(event){
        self.mouseLeave(self, event);
    }, false);

    this.canvas.addEventListener ("mouseout", function(event){
        self.mouseOut(self, event);
    }, false);

    this.canvas.addEventListener("touchstart", function(event) { 
        self.touchDown(self, event);
    }, false);
    this.canvas.addEventListener("touchmove", function(event) { 
        self.touchXY(self, event);
    }, false);
    this.canvas.addEventListener("touchend", function(event) { 
        self.touchUp(self, event);
    }, false);

}

GuitarString.prototype.mouseOver = function(self, event){
    // console.log('mouseOver');
    this.currentMouseX = event.layerX*this.ratio;
    this.currentMouseX = event.layerY*this.ratio;
};
GuitarString.prototype.mouseMove = function (self, event){
    // console.log('mouseMove');
    this.lastMouseX = this.currentMouseX;
    this.lastMouseY = this.currentMouseY;
    this.currentMouseX = event.layerX * this.ratio;
    this.currentMouseY = event.layerY * this.ratio; 

    var radius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                                new Point(this.currentMouseX, this.currentMouseY), 
                                new Point(this.endPoint.x, this.endPoint.y) ).r;
    var currentWaveDistance = radius - Math.sqrt( Math.pow(radius, 2) - Math.pow((Math.abs(this.endPoint.x - this.startPoint.x))/2, 2) );
    var lastRadius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                                	new Point(this.lastMouseX, this.lastMouseY), 
                                	new Point(this.endPoint.x, this.endPoint.y) ).r;
    var lastWaveDistance = lastRadius - Math.sqrt( Math.pow(lastRadius, 2) 
                                        - Math.pow((Math.abs(this.endPoint.x - this.startPoint.x))/2, 2) );
    


    var mouseInGrabRange = currentWaveDistance < this.maxGrabDistance 
        && this.currentMouseX > this.startPoint.x
        && this.currentMouseX < this.endPoint.x;

    var lastMouseOutGrabRange = !(lastWaveDistance < this.maxGrabDistance
        && this.lastMouseX > this.startPoint.x
        && this.lastMouseX < this.endPoint.x);

    var mouseOutControlRange = !(currentWaveDistance < this.maxControlDistance 
        && this.currentMouseX > this.startPoint.x
        && this.currentMouseX < this.endPoint.x);

    var lastMouseInControlRange = lastWaveDistance < this.maxControlDistance
        && this.lastMouseX > this.startPoint.x
        && this.lastMouseY < this.endPoint.x;
    
    var mouseCrossed = intersects(this.lastMouseX, this.lastMouseY, 
                            this.currentMouseX, this.currentMouseY,
                            this.startPoint.x, this.startPoint.y,
                            this.endPoint.x, this.endPoint.y);

    if( mouseInGrabRange && lastMouseOutGrabRange && (!this.userInControl) ){
        // console.log('grab!');
        this.initState = false;
        this.userInControl = true;
        this.waveInControl = false;
        this.waveFinished = false;

        this.redrawActive = true;
    } else if ( mouseOutControlRange && lastMouseInControlRange && this.userInControl){
        // console.log('boing!');
        this.initState = false;
        this.userInControl = false;
        this.waveInControl = true;
        this.waveFinished = false;
        this.waveCount = 0;
        // this.waveInitX = this.lastMouseX;
        // this.waveInitY = this.lastMouseY;
        this.waveInitX = (this.startPoint.x + this.endPoint.x)/2;
        this.waveInitY = this.endPoint.y + this.maxControlDistance;
        // play audio
        play_multi_sound('audio' + this.level);
        // createjs.Sound.play('cello_' + this.level);

    } 

    if( (!this.userInControl)&&mouseCrossed ) {
    	// console.log('i just plucked!');
        this.initState = false;
        this.userInControl = false;
        this.waveInControl = true;
        this.waveFinished = false;
        this.redrawActive = true;
        this.waveCount = 0;
        this.waveInitX = (this.startPoint.x + this.endPoint.y)/2;
        this.waveInitY = this.endPoint.y + this.maxGrabDistance * 2 / 3;
    }
};
GuitarString.prototype.mouseLeave = function(self, event){
    // console.log('mouseLeave');
    if( this.userInControl ) {
        this.initState = false;
        this.userInControl = false;
        this.waveInControl = true;
        this.waveFinished = false;
        this.redrawActive = true;
        this.waveCount = 0;

        this.waveInitX = event.layerX*this.ratio;
        this.waveInitY = event.layerY*this.ratio;

    }
};
GuitarString.prototype.mouseOut = function(self, event){
    // console.log('mouseOut');
};
GuitarString.prototype.touchDown = function(self, event){
    // console.log('touchDown');
    this.currentMouseX = event.layerX*this.ratio;
    this.currentMouseX = event.layerY*this.ratio;
};
GuitarString.prototype.touchXY = function (self, event){
    // console.log('touchMove');
    this.lastMouseX = this.currentMouseX;
    this.lastMouseY = this.currentMouseY;
    this.currentMouseX = event.layerX * this.ratio;
    this.currentMouseY = event.layerY * this.ratio; 

    var radius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                                new Point(this.currentMouseX, this.currentMouseY), 
                                new Point(this.endPoint.x, this.endPoint.y) ).r;
    var currentWaveDistance = radius - Math.sqrt( Math.pow(radius, 2) - Math.pow((Math.abs(this.endPoint.x - this.startPoint.x))/2, 2) );
    var lastRadius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                                    new Point(this.lastMouseX, this.lastMouseY), 
                                    new Point(this.endPoint.x, this.endPoint.y) ).r;
    var lastWaveDistance = lastRadius - Math.sqrt( Math.pow(lastRadius, 2) 
                                        - Math.pow((Math.abs(this.endPoint.x - this.startPoint.x))/2, 2) );
    


    var mouseInGrabRange = currentWaveDistance < this.maxGrabDistance 
        && this.currentMouseX > this.startPoint.x
        && this.currentMouseX < this.endPoint.x;

    var lastMouseOutGrabRange = !(lastWaveDistance < this.maxGrabDistance
        && this.lastMouseX > this.startPoint.x
        && this.lastMouseX < this.endPoint.x);

    var mouseOutControlRange = !(currentWaveDistance < this.maxControlDistance 
        && this.currentMouseX > this.startPoint.x
        && this.currentMouseX < this.endPoint.x);

    var lastMouseInControlRange = lastWaveDistance < this.maxControlDistance
        && this.lastMouseX > this.startPoint.x
        && this.lastMouseY < this.endPoint.x;
    
    var mouseCrossed = intersects(this.lastMouseX, this.lastMouseY, 
                            this.currentMouseX, this.currentMouseY,
                            this.startPoint.x, this.startPoint.y,
                            this.endPoint.x, this.endPoint.y);

    if( mouseInGrabRange && lastMouseOutGrabRange && (!this.userInControl) ){
        // console.log('grab!');
        this.initState = false;
        this.userInControl = true;
        this.waveInControl = false;
        this.waveFinished = false;

        this.redrawActive = true;
    } else if ( mouseOutControlRange && lastMouseInControlRange && this.userInControl){
        // console.log('boing!');
        this.initState = false;
        this.userInControl = false;
        this.waveInControl = true;
        this.waveFinished = false;
        this.waveCount = 0;
        // this.waveInitX = this.lastMouseX;
        // this.waveInitY = this.lastMouseY;
        this.waveInitX = (this.startPoint.x + this.endPoint.x)/2;
        this.waveInitY = this.endPoint.y + this.maxControlDistance;
        // play audio
        play_multi_sound('audio' + this.level);

    } 

    if( (!this.userInControl)&&mouseCrossed ) {
        // console.log('i just plucked!');
        this.initState = false;
        this.userInControl = false;
        this.waveInControl = true;
        this.waveFinished = false;
        this.redrawActive = true;
        this.waveCount = 0;
        this.waveInitX = (this.startPoint.x + this.endPoint.y)/2;
        this.waveInitY = this.endPoint.y + this.maxGrabDistance * 2 / 3;
        // play audio
        // play_multi_sound('audio' + this.level);

    }
};
GuitarString.prototype.touchUp = function(self, event){
    // console.log('touchUp');
    if( this.userInControl ) {
        this.initState = false;
        this.userInControl = false;
        this.waveInControl = true;
        this.waveFinished = false;
        this.redrawActive = true;
        this.waveCount = 0;

        this.waveInitX = event.layerX*this.ratio;
        this.waveInitY = event.layerY*this.ratio;

    }
};


GuitarString.prototype.clear = function(){
	// clear
    // if(this.redrawActive){
    	// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // }
};

GuitarString.prototype.update = function(){
	// console.log(this.redrawActive);
	// if(this.redrawActive){
		if ( this.userInControl ){
            this.thirdPoint = new Point(this.currentMouseX, this.currentMouseY);
        }
        if ( this.waveInControl ){
            var waveX = this.waveInitX;
            var waveY = this.startPoint.y + 
                    (this.waveInitY-this.startPoint.y)
                    *Math.cos(this.waveCount/5*Math.PI)
                    *Math.pow(this.damping, this.waveCount);
    
            if ( Math.pow(this.damping, this.waveCount) > 0.03) {
                // still waving ....
                this.thirdPoint = new Point(waveX, waveY);
                this.waveCount++;
            } else {
                // wave damped to a straight line, wave is finished
                this.waveInControl = false;
                this.waveFinished = true;
                this.lastRedraw = true;
                this.thirdPoint = new Point(waveX, waveY);
            }
        }
	// }
}

GuitarString.prototype.draw = function(){
    // if(this.redrawActive){   
        // draw stuff
    // }
    if(this.lastRedraw) {
        this.drawLine();
        this.lastRedraw = false;
        this.redrawActive = false;
    } else {
        this.drawArc(this.startPoint, this.thirdPoint, this.endPoint);
    }
};
GuitarString.prototype.drawLine = function(){
    // draw a line instead of a flat curve when it stops redraw, pixel-perfect  
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.strokeStyle = this.strokeColor;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.stroke();
};


GuitarString.prototype.drawArc = function(startPoint, thirdPoint, endPoint){
    var ctx = this.ctx;
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = this.strokeColor;

    var centerObject = circleCenter( new Point(startPoint.x, startPoint.y), 
                                     new Point(thirdPoint.x, thirdPoint.y), 
                                     new Point(endPoint.x, endPoint.y) );
    var centerX = centerObject.x;
    var centerY = centerObject.y;
    var r = centerObject.r

    var angle = Math.atan2(centerX-startPoint.x, centerY-startPoint.y);
    // console.log(centerObject);
    if (!angle){
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
    } else {
    	if( angle > Math.PI/2) {
	        ctx.beginPath();
	        ctx.arc(centerX, centerY, r, Math.PI * 1.5-angle, Math.PI * 1.5 + angle, true);
	    } else {
	        ctx.beginPath();
	        ctx.arc(centerX, centerY, r, Math.PI * 1.5-angle, Math.PI * 1.5 + angle, false);
	    }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.stroke();

}
