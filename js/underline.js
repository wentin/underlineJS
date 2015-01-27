var getElementStyles = function(element){
 // lineHeight, height, ratio, fontFamily, fontSize, fontStyle
    var $this = element;

    var baselinePositionRatio = baselineRatio(element);
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
    var parentWidth = $this.parentNode.getBoundingClientRect().width;


    var offsetLeft = $this.offsetLeft;
    var parentOffsetLeft = $this.parentNode.offsetLeft;
    var canvasLeft = parentOffsetLeft - offsetLeft;
    var textIndent = offsetLeft - parentOffsetLeft;

    // canvas.style.left= canvasLeft + 'px';   
    return {
        lineHeight: lineHeight,
        width: width,
        height: height,
        parentWidth: parentWidth,
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontStyle: fontStyle,
        baselinePositionRatio: baselinePositionRatio,
        canvasLeft: canvasLeft,
        textIndent: textIndent
    }
};

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

var myUnderlines = [];
var myMultipleUnderlines = [];
window.onload = function() {
	var underlineElements = document.querySelectorAll(".underline");
    for(var n = 0; n < underlineElements.length; n++) {

    	var element = underlineElements[n];

    	var underlineStyles = {
    		'text-underline-color': '#000',
    		'text-underline-position': 'auto', // could be ratio or todo: px 
    		'text-underline-skip': true,
    		'text-underline-width': 'auto' // could be auto or px or ratio
    	}


    	var elementStyles = getElementStyles(element);
    	// single line or multiple line?
		if (elementStyles.height > elementStyles.lineHeight) {
			// multiple lines
			// console.log('multiple lines');
    		var myUnderline = new MultipleUnderline(element, underlineStyles, elementStyles);
    		// myUnderline.update();
    		// myUnderline.draw();
    		myUnderlines.push(myUnderline);
		} else {
			// single line
    		var myUnderline = new SingleUnderline(element, underlineStyles, elementStyles);
    		myUnderlines.push(myUnderline);
		}

		// if(window.device)
    }
}


function animate() {	

	for(var i = 0; i < myUnderlines.length; i++) {
	    var myUnderline = myUnderlines[i];

		// clear
	    myUnderline.clear();
	    
		// update
		myUnderline.update();
		
		// draw stuff
	    myUnderline.draw();
	}

	
	// request new frame
	requestAnimFrame(function() {
	  animate();
	});
}
animate();

//audio play multiple channels at the same time: http://www.storiesinflight.com/html5/audio.html
var channel_max = 10; // number of channels
audiochannels = new Array();
for (a = 0; a < channel_max; a++) { // prepare the channels
    audiochannels[a] = new Array();
    audiochannels[a]['channel'] = new Audio(); // create a new audio object
    audiochannels[a]['finished'] = -1; // expected end time for this channel
}

function play_multi_sound(s) {
    for (a = 0; a < audiochannels.length; a++) {
        thistime = new Date();
        if (audiochannels[a]['finished'] < thistime.getTime()) { // is this channel finished?
            audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration * 1000;
            audiochannels[a]['channel'].src = document.getElementById(s).src;
            audiochannels[a]['channel'].load();
            audiochannels[a]['channel'].play();
            break;
        }
    }
}
