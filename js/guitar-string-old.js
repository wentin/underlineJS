var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

var dist = function(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

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



function GuitarString(ctx, startPoint, endPoint, strokeWidth, strokeColor) {
	//ctor
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    // this.canvas.width = this.canvas.clientWidth;
    // this.canvas.height = this.canvas.clientHeight*1.2;

	this.startPoint = startPoint;
	this.endPoint = endPoint;

    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;

    //init points that will be updated all the time.
	this.controlPoint = new Point((this.startPoint.x + this.endPoint.x)/2, this.startPoint.y);
    this.thirdPoint = new Point((this.startPoint.x + this.endPoint.x)/2, this.startPoint.y);
    // this.controlPoint;
    // this.thirdPoint;
    this.lastMouseX;
    this.lastMouseY;
    
    this.maxGrabDistance = this.strokeWidth * 3;
    this.maxControlDistance = this.strokeWidth * 12;

    // wave configurations
    this.waveInitX = (this.startPoint.x + this.endPoint.x)/2;
    this.waveInitY = this.startPoint.y - this.maxControlDistance;

    this.waveCount = 0;
    this.damping = 0.95;


    // state flags
    this.userInControl = false;
    this.userPlucked = false;
    this.waveInControl = false;
	this.waveFinished = false;
    this.initState = true;
    this.mouseOutWaveInControl = false;
    this.mouseOutWaveFinished = false;

    this.redrawActive = false;


    // init draw the line
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.strokeStyle = this.strokeColor;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.stroke();

	//add event listener
	var self = this;
    this.canvas.addEventListener('mouseover',  function(pos) { 
        self.mouseOver(self, pos);
    }, false);

	this.canvas.addEventListener('mousemove',  function(pos) { 
		self.mouseMove(self, pos);
	}, false);

    this.canvas.addEventListener ("mouseleave", function(event){
        self.mouseLeave(self,event);
    }, false);
}

GuitarString.prototype.drawArc = function(startPoint, thirdPoint, endPoint){
    var ctx = this.ctx;
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = this.strokeColor;
    // console.dir(ctx);
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

    var angle = Math.atan2(centerX-startPoint.x, centerY-startPoint.y);

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
    // ctx.rect(centerX, centerY, 2, 2);
    // ctx.rect(startPoint.x, startPoint.y, 2, 2);
    // ctx.rect(endPoint.x, endPoint.y, 2, 2);
    ctx.stroke();

}

GuitarString.prototype.draw = function(){
    if(this.redrawActive){	
    	// draw stuff
        if ( this.waveFinished || this.initState){
            // draw a straight line 
            this.ctx.lineWidth = this.strokeWidth;
            this.ctx.strokeStyle = this.strokeColor;
                this.ctx.beginPath();
                this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
                this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
                this.ctx.stroke();
        } else {
            // console.log('arc happens here!');
            this.drawArc(this.startPoint, this.thirdPoint, this.endPoint);
        }
    }
};

GuitarString.prototype.clear = function(){
	// clear
    if(this.redrawActive){
    	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};


GuitarString.prototype.update = function(){
	// update
    if(this.redrawActive){
        var radius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                                new Point(this.controlPoint.x, this.controlPoint.y), 
                                new Point(this.endPoint.x, this.endPoint.y) ).r;
    
        var lastRadius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                                new Point(this.lastMouseX, this.lastMouseY), 
                                new Point(this.endPoint.x, this.endPoint.y) ).r;
    
        var currentWaveDistance = radius - Math.sqrt( Math.pow(radius, 2) 
                                        - Math.pow((Math.abs(this.endPoint.x - this.startPoint.x))/2, 2) );
        var lastWaveDistance = lastRadius - Math.sqrt( Math.pow(lastRadius, 2) 
                                        - Math.pow((Math.abs(this.endPoint.x - this.startPoint.x))/2, 2) );
    
        var mouseInGrabRange = currentWaveDistance < this.maxGrabDistance 
            && this.controlPoint.x > this.startPoint.x
            && this.controlPoint.x < this.endPoint.x;
    
        var lastMouseOutGrabRange = !(lastWaveDistance < this.maxGrabDistance
            && this.lastMouseX > this.startPoint.x
            && this.lastMouseX < this.endPoint.x);
    
        var mouseOutControlRange = !(currentWaveDistance < this.maxControlDistance 
            && this.controlPoint.x > this.startPoint.x
            && this.controlPoint.x < this.endPoint.x);
    
        var lastMouseInControlRange = lastWaveDistance < this.maxControlDistance
            && this.lastMouseX > this.startPoint.x
            && this.lastMouseX < this.endPoint.x;
    
        /*if( !this.userPlucked ){
            this.userPlucked = intersects(this.lastMouseX, this.lastMouseY, 
                                    this.controlPoint.x, this.controlPoint.y,
                                    this.startPoint.x, this.startPoint.y,
                                    this.endPoint.x, this.endPoint.y);
            if (this.userPlucked) {
                this.userInControl = false;
                this.waveInControl = true;
                this.waveInitX = (this.startPoint.x + this.endPoint.y)/2;
                this.waveInitY = this.endPoint.y + 15;
            }
        }*/
    
        if( mouseInGrabRange && lastMouseOutGrabRange ){
            this.initState = false;
            this.waveFinished = false;
            this.userInControl = true;
            this.waveInControl = false;
    
        } else if ( mouseOutControlRange && lastMouseInControlRange){
            this.initState = false;
            this.userInControl = false;
            this.waveInControl = true;
            this.waveCount = 0;
            this.waveInitX = this.lastMouseX;
            this.waveInitY = this.lastMouseY;
        }
    
        if ( this.userInControl ){
            this.thirdPoint = new Point(this.controlPoint.x, this.controlPoint.y);
        }
        if ( this.waveInControl || this.mouseOutWaveInControl){
            var waveX = this.waveInitX;
            var waveY = this.startPoint.y + 
                    (this.waveInitY-this.startPoint.y)
                    *Math.cos(this.waveCount/5*Math.PI)
                    *Math.pow(this.damping, this.waveCount);
    
            if ( Math.pow(this.damping, this.waveCount) < 0.01) {
                // wave damped to a straight line, wave is finished
                this.waveInControl = false;
                this.waveFinished = true;
                if ( this.mouseOutWaveInControl) {
                    this.mouseOutWaveInControl = false;
                    this.mouseOutWaveFinished = true;
                    this.redrawActive = false;
                }
                // this.userPlucked = false;
            } else {
                // still waving ....
                this.thirdPoint = new Point(waveX, waveY);
                this.waveCount++;
            }
        }
    }


};

GuitarString.prototype.resize = function(){
    // resize canvas
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
};

GuitarString.prototype.mouseOver = function(self, event){
    // self.controlPoint.x = event.layerX;
    // self.controlPoint.y = event.layerY;  
    self.redrawActive = true;
    self.controlPoint = new Point(event.layerX, event.layerY);
    self.lastMouseX = event.layerX;
    self.lastMouseY = event.layerY; 
};

GuitarString.prototype.mouseMove = function(self, event){
    self.lastMouseX = self.controlPoint.x;
    self.lastMouseY = self.controlPoint.y;
	self.controlPoint.x = event.layerX;
	self.controlPoint.y = event.layerY;	
    // console.log('redraw is active' + self.redrawActive);
    // console.log('still init state' + self.initState);

};

GuitarString.prototype.mouseLeave = function(self, event){
    // self.lastMouseX = event.layerX;
    // self.lastMouseY = event.layerY;
    if (self.userInControl) {
        //if user is in control when mouse out, start waving
        self.userInControl = false;
        self.waveInControl = true;
        self.mouseOutWaveInControl = true;
        self.waveCount = 0;
    } else 
    if (self.waveInControl) {
        //if wave is in control when mouse out, continue waving but remember this is the last wave
        self.mouseOutWaveInControl = true;
        self.waveCount = 0;
    } else
    if (self.waveFinished || self.initState) {
        //if it is either wave finished state or init state, meaning it is a line when mouse out, stop redraw right away.
        
        // console.log("redraw active" + self.redrawActive);
        self.redrawActive = false;
    }
    // console.log(self.mouseOutWaveInControl);
    // console.log("redraw active" + self.redrawActive);
};