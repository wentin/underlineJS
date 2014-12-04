
function drawText(canvas, text, fontFamily, fontSize, spanHeight){
	var text = text;
	var canvas = canvas;
	var ctx = canvas.getContext('2d');

	ctx.font = fontSize + ' ' + fontFamily;
    var metrics = ctx.measureText('.');
    var strokeWidth = metrics['width'];
    if (strokeWidth/10 <= 2) {
    	// strokeWidth = strokeWidth/10;
    	strokeWidth = Math.round( strokeWidth/5 )/2;
    } else {
    	strokeWidth = Math.round( strokeWidth/10 );
    }
    // strokeWidth = 1;
    // console.log(strokeWidth);

	// ctx.font = '18px Georgia';
	ctx.font = fontSize + ' ' + fontFamily;
    var metrics = ctx.measureText(text);
    canvas.width = metrics['width'];
	canvas.height = spanHeight;

    var posY = canvas.height * 0.93;
    if(strokeWidth <= 1 || (strokeWidth%2 && strokeWidth > 2)) {
	    posY = Math.round(posY - 0.5) + 0.5;
    } else {
    	posY = Math.round(posY);
    }
    // posY = 19.5;
    // console.log(posY);

	ctx.strokeStyle = '#666666';
    ctx.lineWidth = strokeWidth;

	ctx.moveTo(0, posY);
	ctx.lineTo(canvas.width, posY);
	ctx.stroke();

	ctx.globalCompositeOperation = "destination-out";
	ctx.font = fontSize + ' ' + fontFamily;
	ctx.textBaseline = 'top';

	ctx.lineWidth = 3;
	ctx.strokeStyle = 'blue';
	ctx.strokeText(text, 0, 0);

	// ctx.globalCompositeOperation = "source-over";
	// ctx.font = fontSize + ' ' + fontFamily;
	// ctx.fillStyle = 'orangered';
	// ctx.textBaseline = 'top';
	// ctx.fillText(text, 0, 0);

}
$(function(){
	var lastSpan;
	$('.underline').each(function(){
		// console.log(window.getComputedStyle($(this)[0], null));
		var fontFamily = window.getComputedStyle($(this)[0], null).getPropertyValue("font-family");
		var fontSize = window.getComputedStyle($(this)[0], null).getPropertyValue("font-size");
		var words = $(this).text().split(" ");
		var total = words.length;
		$(this).empty();
		var spanHeight = 0;
		for (index = 0; index < total; index ++){
			var underlineSpan = document.createElement("span");
			underlineSpan.classList.add("und");
			underlineSpan.innerHTML = words[index]+' ';
			var canvas = document.createElement("canvas");
			underlineSpan.appendChild(canvas);
			$(this)[0].appendChild(underlineSpan);
			if (index == 0) {
				spanHeight = underlineSpan.offsetHeight;
			}
			if(lastSpan) {
				//not the first span, now check if offsetTop changes from last time
				if (underlineSpan.offsetTop === lastSpan.offsetTop) {
					// offsetTop didn't change, no line break
					drawText(lastSpan.childNodes[1], lastSpan.innerText, fontFamily, fontSize, spanHeight);
				} else {
					// offsetTop changes, means the line breaks
					lastSpan.classList.add("br");
					drawText(lastSpan.childNodes[1], lastSpan.innerText.replace(/\s+/g, ''), fontFamily, fontSize, spanHeight);
				}
			}
			// drawText(canvas, underlineSpan.innerText);
			// console.log(window.getComputedStyle(underlineSpan, null).getPropertyValue("height"));
			
			console.dir(lastSpan);
			// debugger;
			console.log(lastSpan.offsetWidth);
			lastSpan = underlineSpan;

		}		
		// render the very last word
		drawText(lastSpan.childNodes[1], lastSpan.innerText, fontFamily, fontSize, spanHeight);
	})
})
