function String(id, startPoint, endPoint, strokeWidth, strokeColor) {
	//ctor
	this.canvas = document.getElementById(id);
	this.ctx = this.canvas.getContext('2d');

    // console.dir(this.canvas);
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

	this.startPoint = startPoint;
	this.endPoint = endPoint;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
	this.controlPoint = new Point(0,0);
    this.thirdPoint = new Point(0,0);

    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.strokeStyle = this.strokeColor;
    

    this.waveInitX = (this.startPoint.x + this.endPoint.x)/2;
    this.waveInitY = this.startPoint.y;

	this.lastMouseX = this.controlPoint.x;
    this.lastMouseY = this.controlPoint.y;
    this.waveCount = 0;
    this.damping = 0.98;

    this.userInControl = false;
    this.userPlucked = false;
    this.waveInControl = false;
	this.waveFinished = false;

	//add event listener
	var self = this;
	this.canvas.addEventListener('mousemove',  function(pos) { 
		// console.dir(pos);
		self.mouseMove(self, pos) 
	}, false);
}

String.prototype.drawArc = function(startPoint, thirdPoint, endPoint, ctx){
    var ctx = ctx;

    var dy1 = thirdPoint.y - startPoint.y;
    var dx1 = thirdPoint.x - startPoint.x;
    var dy2 = endPoint.y - thirdPoint.y;
    var dx2 = endPoint.x - thirdPoint.x;

    var aSlope = dy1/dx1;
    var bSlope = dy2/dx2;  


    var centerX = (aSlope*bSlope*(startPoint.y - endPoint.y) + bSlope*(startPoint.x + thirdPoint.x)
        - aSlope*(thirdPoint.x+endPoint.x) )/( 2* (bSlope-aSlope) );
    var centerY = -1*(centerX - (startPoint.x+thirdPoint.x)/2)/aSlope +  (startPoint.y+thirdPoint.y)/2;
    
    // var centerX = (aSlope*bSlope*(y0 - y2) + bSlope*(x0 + x1)
    //     - aSlope*(x1+x2) )/( 2* (bSlope-aSlope) );
    // var centerY = -1*(centerX - (x0+x1)/2)/aSlope +  (y0+y1)/2;
    var r = dist(centerX, centerY, startPoint.x, startPoint.y)

    var angle = Math.atan2(centerX-startPoint.x, centerY-startPoint.y);

    if (!angle){
        // console.log(angle);
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
String.prototype.draw = function(){
	
	// draw stuff
    var initState = (!this.userInControl) && (!this.waveInControl) && (!this.waveFinished)
    if ( this.waveFinished || initState){
        // console.log('line');
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.stroke();
    } else {
        this.drawArc(this.startPoint, this.thirdPoint, this.endPoint, this.ctx);
    }
};

String.prototype.clear = function(){
	// clear
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};


String.prototype.update = function(){
	// update
	var radius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                            new Point(this.controlPoint.x, this.controlPoint.y), 
                            new Point(this.endPoint.x, this.endPoint.y) ).r;

    var lastRadius = circleCenter(  new Point(this.startPoint.x, this.startPoint.y), 
                            new Point(this.lastMouseX, this.lastMouseY), 
                            new Point(this.endPoint.x, this.endPoint.y) ).r;
    // console.log(r);


    var mouseInGrabRange = radius > 9000 
        && this.controlPoint.x > this.startPoint.x
        && this.controlPoint.x < this.endPoint.x;

    var lastMouseOutGrabRange = !(lastRadius > 9000
        && this.lastMouseX > this.startPoint.x
        && this.lastMouseY < this.endPoint.x);

    var mouseOutControlRange = !(radius > 900 
        && this.controlPoint.x > this.startPoint.x
        && this.controlPoint.x < this.endPoint.x);

    var lastMouseInControlRange = lastRadius > 900
        && this.lastMouseX > this.startPoint.x
        && this.lastMouseY < this.endPoint.x;

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
        this.waveCount = 0;
        this.waveFinished = false;
        this.userInControl = true;
        this.waveInControl = false;

    } else if ( mouseOutControlRange && lastMouseInControlRange){

        this.userInControl = false;
        this.waveInControl = true;
        this.waveInitX = this.lastMouseX;
        this.waveInitY = this.lastMouseY;
        // this.drawArc(this.startPoint, wavePoint, this.endPoint, this.ctx);
    }



    if ( this.userInControl ){
        // this.drawArc(this.startPoint, this.controlPoint, this.endPoint, this.ctx);
        this.thirdPoint = new Point(this.controlPoint.x, this.controlPoint.y);
    } else if ( this.waveInControl && !this.waveFinished ){
        // console.log(this.lastMouseY);
        // console.log(this.waveInitY);
        var waveX = this.waveInitX;
        var waveY = this.startPoint.y + 
                (this.waveInitY-this.startPoint.y)
                *Math.cos(this.waveCount/5*Math.PI)
                *Math.pow(this.damping, this.waveCount);

        if ( Math.pow(this.damping, this.waveCount) < 0.01) {
            // wave damped to a straight line, wave is finished
            // console.log('damp to line');
            this.waveInControl = false;
            this.waveFinished = true;
            // this.userPlucked = false;
        } else {
            // still waving ....
            this.thirdPoint = new Point(waveX, waveY);
            this.waveCount++;
        }
    }

    this.lastMouseX = this.controlPoint.x;
    this.lastMouseY = this.controlPoint.y;

};

String.prototype.resize = function(){
    // resize canvas
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
};

String.prototype.mouseMove = function(self, pos){
	self.controlPoint.x = pos.layerX;
	self.controlPoint.y = pos.layerY;	
};