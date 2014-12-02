
function drawText(canvas, text){
	var text = text;
	var canvas = canvas;
	var ctx = canvas.getContext('2d');

	// canvas.width = canvas.offsetWidth + 5;
	// canvas.height = canvas.offsetHeight;
	ctx.strokeStyle = '#666666';
    ctx.lineWidth = 0.5;
    var posY = 19.5;
    console.log(posY);
	ctx.moveTo(0, posY);
	ctx.lineTo(canvas.width, posY);
	ctx.stroke();

	ctx.globalCompositeOperation = "destination-out";
	ctx.font         = '18px Georgia';
	ctx.fillStyle = '#666666';
	ctx.textBaseline = 'top';
	ctx.fillText  (text, -0.5, 0);
	ctx.fillText  (text, -1, 0);
	ctx.fillText  (text, -1.5, 0);
	ctx.fillText  (text, -2, 0);

	ctx.font         = '18px Georgia';
	ctx.fillStyle = '#666666';
	ctx.textBaseline = 'top';
	ctx.fillText  (text, 0.5, 0);
	ctx.fillText  (text, 1, 0);
	ctx.fillText  (text, 1.5, 0);
	ctx.fillText  (text, 2, 0);

	ctx.globalCompositeOperation = "source-over";
	ctx.font         = '18px Georgia';
	ctx.fillStyle = 'orangered';
	ctx.textBaseline = 'top';
	ctx.fillText  (text, 0, 0);

}
$(function(){
	$('.underline').each(function(){
		var words = $(this).text().split(" ");
		var total = words.length;
		$(this).empty();
		for (index = 0; index < total; index ++){
			var underlineSpan = $("<span class='und'></span> ").text(words[index]+' ');
		    $(this).append(underlineSpan);
			var canvasEL = $('<canvas></canvas>');
			underlineSpan.append(canvasEL);
			var canvas = canvasEL[0];
			// this is 5px offset on width, wonder why
			canvas.width = underlineSpan[0].offsetWidth + 4;
			canvas.height = underlineSpan[0].offsetHeight;
			drawText(canvas, words[index]+' ')
		}
	})
})
