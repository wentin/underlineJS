window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

var myUnderlines = [];
window.onload = function() {
	var underlineElements = document.querySelectorAll(".underline");
    for(var n = 0; n < underlineElements.length; n++) {

    	var element = underlineElements[n];


    	var underlineStyles = {
    		'text-underline-color': '#fd471e',
    		'text-underline-position': 0.15, // could be ratio or px 
    		'text-underline-skip': true,
    		'text-underline-width': 'auto' // could be auto or px or ratio
    	}
    	// debugger;
    	var myUnderline = new Underline(element, underlineStyles);
    	myUnderlines.push(myUnderline);
    }
}


function animate() {	

	for(var i = 0; i < myUnderlines.length; i++) {
	    var myUnderline = myUnderlines[i];
		// update
		myUnderline.update();

		// clear
	    myUnderline.clear();
		
		// draw stuff
	    myUnderline.drawUnderline();
	    myUnderline.drawHoles();
	}

	
	// request new frame
	requestAnimFrame(function() {
	  animate();
	});
}
animate();
