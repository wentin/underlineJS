// global variables for browser detection
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



window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

var myStrings = [];

(function animate() {	
	for(var i = 0; i < myStrings.length; i++) {
	    var myString = myStrings[i];
		// update
		myString.update();

		// clear
	    myString.clear();
		
		// draw stuff
	    // console.log("run every frame");
	    myString.draw();
	}


	// request new frame
	requestAnimFrame(function() {
	  animate();
	});
})()

function drawTextSingleLine (canvas, text, textUnderlineDistance,  lineHeight, height, ratio, fontFamily, fontSize, fontStyle) {
	var ctx = canvas.getContext('2d');
	
	// calculate the best underline's strokeWidth
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
    var dotMetrics = ctx.measureText('.');
    var dotWidth = dotMetrics['width'];
    var strokeWidth;
    if (dotWidth/6 <= 2) {
    	// strokeWidth = strokeWidth/10;
    	strokeWidth = Math.round( dotWidth/3 )/2;
    } else {
    	strokeWidth = Math.round( dotWidth/6 );
    }

    // calculate the best underline position y
	// var posY = parseFloat(fontSize) * 0.89;
	// console.log(height);
	// console.log(fontSize);
	// posY should be baseLinePosY + textUnderlineDistance (could be px or %)
	var posY = parseFloat(height) * (1 - ratio + textUnderlineDistance);


	// console.log(posY);
	if(strokeWidth <= 1 || (strokeWidth%2 && strokeWidth > 2)) {
	    posY = Math.round(posY - 0.5) + 0.5;
    } else {
    	posY = Math.round(posY);
    }

	// 	draw the underline
	// console.log(text);
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
	ctx.fillStyle = 'green';
	ctx.textBaseline = 'top';
	var textMetrics = ctx.measureText(text);
	var textWidth = textMetrics.width;

	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = 'orangered';
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
	ctx.moveTo(0, posY);
	ctx.lineTo(textWidth, posY);
	ctx.stroke();
	// var canvas = canvas;
	// var myString = new String(canvas, new Point(0, posY), new Point(textWidth, posY),
	// 	strokeWidth, "#bad424");
	// myStrings.push(myString);

	// update
	// myString.update();

	// clear
    // myString.clear();
	
	// draw stuff
    // myString.draw();


	// draw the font stroke				
	ctx.globalCompositeOperation = "destination-out";
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
	ctx.fillStyle = 'green';
	ctx.textBaseline = 'top';
	ctx.fillText(text, 0, 0);
	// console.log(strokeWidth);
	ctx.lineWidth = 3 + strokeWidth;
	ctx.strokeStyle = 'blue';
	ctx.strokeText(text, 0, 0);

}

function drawText(canvas, text, x, y, maxWidth, textUnderlineDistance, lineHeight, fontFamily, fontSize, fontStyle){
	var ctx = canvas.getContext('2d');

	if (is_chrome) {
		// chrome floor the lineheight when it is not a whole number
		lineHeight = Math.floor(lineHeight);
	}
	
	// calculate the best underline's strokeWidth
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
    var dotMetrics = ctx.measureText('.');
    var dotWidth = dotMetrics['width'];
    var strokeWidth;
    if (dotWidth/6 <= 2) {
    	// strokeWidth = strokeWidth/10;
    	strokeWidth = Math.round( dotWidth/3 )/2;
    } else {
    	strokeWidth = Math.round( dotWidth/6 );
    }

    
    // calculate the best underline position y
	var posY = parseFloat(fontSize) * 0.89;
	// console.log(posY);
	if(strokeWidth <= 1 || (strokeWidth%2 && strokeWidth > 2)) {
	    posY = Math.round(posY - 0.5) + 0.5;
    } else {
    	posY = Math.round(posY);
    }

	if(strokeWidth <= 1 || (strokeWidth%2 && strokeWidth > 2)) {
	    posY = Math.round(posY - 0.5) + 0.5;
    } else {
    	posY = Math.round(posY);
    }

	var words = text.split(' ');
    var line = '';

    var firstLineCount = 0;
    for(var n = 0; n < words.length; n++) {
	// add the whitespace after getting the width measurement
      var testLine = line + words[n];
      var testLineMetrics = ctx.measureText(testLine);
      var testLineWidth = testLineMetrics.width;
	      testLine = testLine + ' ';


      if (!firstLineCount) {
      	//the first line, should consider startingPointX
		if (testLineWidth + x > maxWidth && n > 0) {
			// 	draw the underline
			// console.log(line);
			var lineMetrics = ctx.measureText(line);
      		var lineWidth = lineMetrics.width;
			ctx.globalCompositeOperation = "source-over";

			ctx.strokeStyle = 'orangered';
		    ctx.lineWidth = strokeWidth;

			ctx.beginPath();
			ctx.moveTo(x, posY);
			ctx.lineTo(lineWidth + x, posY);
			ctx.stroke();

			// draw the font stroke
	
			ctx.globalCompositeOperation = "destination-out";
			ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
			ctx.fillStyle = 'green';
			ctx.textBaseline = 'top';
			ctx.fillText(line, x, y);
			ctx.lineWidth = 3 + strokeWidth;
			ctx.strokeStyle = 'blue';
			ctx.strokeText(line, x, y);

			line = words[n] + ' ';
			y += lineHeight;
			// console.log("lineHeight:");
			// console.log(lineHeight);
			// console.log("y:");
			// console.log(y);
      		firstLineCount++;
		} else {
			line = testLine;
		}
      } else {
		if (testLineWidth > maxWidth && n > 0) {
			// 	draw the underline
			// console.log(line);
			var lineMetrics = ctx.measureText(line);
      		var lineWidth = lineMetrics.width;

			ctx.globalCompositeOperation = "source-over";
			// var posY = 24 * 0.9;

			ctx.strokeStyle = 'orangered';
		    ctx.lineWidth = strokeWidth;
		    ctx.beginPath();
			ctx.moveTo(0, y + posY);
			ctx.lineTo(lineWidth - 4, y + posY);
			ctx.stroke();

			// draw the font stroke
			ctx.globalCompositeOperation = "destination-out";
			ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
			ctx.fillStyle = 'green';
			ctx.textBaseline = 'top';
			ctx.fillText(line, 0, y);
			ctx.lineWidth = 3 + strokeWidth;
			ctx.strokeStyle = 'blue';
			ctx.strokeText(line, 0, y);

			line = words[n] + ' ';
			y += lineHeight;
		} else {
			line = testLine;
		}
      }
    }
    // draw the last line
	// 	draw the underline
	// console.log(line);
	var lineMetrics = ctx.measureText(line);
	var lineWidth = lineMetrics.width;
	ctx.globalCompositeOperation = "source-over";

	ctx.strokeStyle = 'orangered';
	ctx.lineWidth = strokeWidth;
	ctx.beginPath();
	ctx.moveTo(0, y + posY);
	ctx.lineTo(lineWidth - 4, y + posY);
	ctx.stroke();

	// draw the font stroke
	ctx.globalCompositeOperation = "destination-out";
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
	ctx.fillStyle = 'green';
	ctx.textBaseline = 'top';
	ctx.fillText(line, 0, y);
	ctx.lineWidth = 3 + strokeWidth;
	ctx.strokeStyle = 'blue';
	ctx.strokeText(line, 0, y);

}

window.onload = function() {
	var underlineElements = document.querySelectorAll(".underline");
    for(var n = 0; n < underlineElements.length; n++) {
    	$this = underlineElements[n];

    	// add string animation to underline 

		var ratio = baselineRatio($this);
		// console.log(ratio);
		var lineHeight = parseFloat(window.getComputedStyle($this, null)
				.getPropertyValue("line-height"));
		var fontFamily = window.getComputedStyle($this, null)
				.getPropertyValue("font-family");
		var fontSize = window.getComputedStyle($this, null)
				.getPropertyValue("font-size");
		var fontStyle = window.getComputedStyle($this, null)
				.getPropertyValue("font-style");
		var width = $this.getBoundingClientRect().width;
		var height = $this.getBoundingClientRect().height;
		var maxWidth = $this.parentNode.getBoundingClientRect().width;
		var canvas = document.createElement("canvas");
	    canvas.width = width;
		canvas.height = height;
		// console.log("line-height:");
		// console.log(lineHeight);
		// console.log("height:");
		// console.log(height);
		var textUnderlineDistance = 0.16;
		var text = $this.textContent;
		// console.log(text);

		$this.appendChild(canvas);

		// single line or multiple line?
		if (height > lineHeight) {
			// multiple lines
			var offsetLeft = $this.offsetLeft;
			var parentOffsetLeft = $this.parentNode.offsetLeft;
			var canvasLeft = parentOffsetLeft - offsetLeft;
			var startPointX = offsetLeft - parentOffsetLeft;
			var startPointY = 0;
			canvas.style.left= canvasLeft + 'px';
			// console.log(lineHeight);
			drawText(canvas, text, startPointX, startPointY, maxWidth, textUnderlineDistance,
				lineHeight, fontFamily, fontSize, fontStyle);

		} else {
			// single line
			drawTextSingleLine (canvas, text, textUnderlineDistance, lineHeight, height, ratio, fontFamily, fontSize, fontStyle)
		}
	}
}
