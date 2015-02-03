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
    var sound00 = "cello_00";
    var sound01 = "cello_01";
    var sound02 = "cello_02";
    var sound03 = "cello_03";
    var sound04 = "cello_04";
    var sound05 = "cello_05";
    var sound06 = "cello_06";
    var sound07 = "cello_07";
    var sound08 = "cello_08";
    var sound09 = "cello_09";
    var sound10 = "cello_10";
    var sound11 = "cello_11";
    var sound12 = "cello_12";
    var sound13 = "cello_13";
    var sound14 = "cello_14";
    var sound15 = "cello_15";
    var sound16 = "cello_16";
    var sound17 = "cello_17";
    var sound18 = "cello_18";
    var sound19 = "cello_19";
    function loadSound () {
        createjs.Sound.registerSound("audio/cello_00.mp3", sound00);
        createjs.Sound.registerSound("audio/cello_01.mp3", sound01);
        createjs.Sound.registerSound("audio/cello_02.mp3", sound02);
        createjs.Sound.registerSound("audio/cello_03.mp3", sound03);
        createjs.Sound.registerSound("audio/cello_04.mp3", sound04);
        createjs.Sound.registerSound("audio/cello_05.mp3", sound05);
        createjs.Sound.registerSound("audio/cello_06.mp3", sound06);
        createjs.Sound.registerSound("audio/cello_07.mp3", sound07);
        createjs.Sound.registerSound("audio/cello_08.mp3", sound08);
        createjs.Sound.registerSound("audio/cello_09.mp3", sound09);
        createjs.Sound.registerSound("audio/cello_10.mp3", sound10);
        createjs.Sound.registerSound("audio/cello_11.mp3", sound11);
        createjs.Sound.registerSound("audio/cello_12.mp3", sound12);
        createjs.Sound.registerSound("audio/cello_13.mp3", sound13);
        createjs.Sound.registerSound("audio/cello_14.mp3", sound14);
        createjs.Sound.registerSound("audio/cello_15.mp3", sound15);
        createjs.Sound.registerSound("audio/cello_16.mp3", sound16);
        createjs.Sound.registerSound("audio/cello_17.mp3", sound17);
        createjs.Sound.registerSound("audio/cello_18.mp3", sound18);
        createjs.Sound.registerSound("audio/cello_19.mp3", sound19);
    };
    loadSound();
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

/*//audio play multiple channels at the same time: http://www.storiesinflight.com/html5/audio.html
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
}*/
