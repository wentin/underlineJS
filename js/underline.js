
function drawText(canvas, text){
	var text = text;
	var canvas = canvas;
	var ctx = canvas.getContext('2d');



	ctx.font = '18px Georgia';
    var metrics = ctx.measureText(text);
    canvas.width = metrics['width'];
	canvas.height = canvas.offsetHeight;

	ctx.strokeStyle = '#666666';
    ctx.lineWidth = 0.5;
    var posY = 19.5;

	ctx.moveTo(0, posY);
	ctx.lineTo(canvas.width, posY);
	ctx.stroke();

	ctx.globalCompositeOperation = "destination-out";
	ctx.font = '18px Georgia';
	ctx.fillStyle = 'orangered';
	ctx.textBaseline = 'top';
	ctx.fillText(text, -0.5, 0);
	ctx.fillText(text, -1, 0);
	ctx.fillText(text, -1.5, 0);
	ctx.fillText(text, -2, 0);
	ctx.fillText(text, -2.5, 0);


	ctx.font = '18px Georgia';
	ctx.fillStyle = 'orangered';
	ctx.textBaseline = 'top';
	ctx.fillText(text, 0.5, 0);
	ctx.fillText(text, 1, 0);
	ctx.fillText(text, 1.5, 0);
	ctx.fillText(text, 2, 0);
	ctx.fillText(text, 2.5, 0);

	// ctx.globalCompositeOperation = "source-over";
	ctx.font         = '18px Georgia';
	ctx.fillStyle = 'orangered';
	ctx.textBaseline = 'top';
	ctx.fillText(text, 0, 0);

}
$(function(){
	var lastSpan;
	$('.underline').each(function(){
		var words = $(this).text().split(" ");
		var total = words.length;
		$(this).empty();
		for (index = 0; index < total; index ++){

			var underlineSpan = document.createElement("span");
			underlineSpan.classList.add("und");
			underlineSpan.innerHTML = words[index]+' ';
			var canvas = document.createElement("canvas");
			underlineSpan.appendChild(canvas);
			$(this)[0].appendChild(underlineSpan);
			if(lastSpan) {
				//not the first span, now check if offsetTop changes from last time
				if (underlineSpan.offsetTop === lastSpan.offsetTop) {
					// offsetTop didn't change, no line break
					drawText(lastSpan.childNodes[1], lastSpan.innerText);
				} else {
					// offsetTop changes, means the line breaks
					lastSpan.classList.add("br");
					drawText(lastSpan.childNodes[1], lastSpan.innerText.replace(/\s+/g, ''));
				}
			}
			// drawText(canvas, underlineSpan.innerText);

			lastSpan = underlineSpan;
		}
		// render the very last word
		drawText(lastSpan.childNodes[1], lastSpan.innerText);
	})
})
