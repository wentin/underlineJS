
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

window.onload = function() {
	var ctx = document.getElementById('canvas').getContext('2d');
    var myGuString = new GuitarString(ctx, 
        new Point(100, 50), 
        new Point(600, 50), 
        1, "#bad424");

	function animate() {	

		// clear before update, because update draw the last line
		myGuString.clear();

		// update
		myGuString.update();

		// redraw 
		myGuString.draw();

		// request new frame
		requestAnimFrame(function() {
		  animate();
		});
	}
	animate();
}
