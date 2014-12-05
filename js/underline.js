function drawTextSingleLine (canvas, text, fontFamily, fontSize, fontStyle) {
	var ctx = canvas.getContext('2d');

	// 	draw the underline

	console.log(text);
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
	ctx.fillStyle = 'green';
	ctx.textBaseline = 'top';
	var textMetrics = ctx.measureText(text);
	var textWidth = textMetrics.width;
	ctx.globalCompositeOperation = "source-over";
	var posY = canvas.height * 0.9;
	var strokeWidth = 1;

	ctx.strokeStyle = 'orangered';
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
	ctx.moveTo(0, posY);
	ctx.lineTo(textWidth, posY);
	ctx.stroke();

	// draw the font stroke				
	ctx.globalCompositeOperation = "destination-out";
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
	ctx.fillStyle = 'green';
	ctx.textBaseline = 'top';
	ctx.fillText(text, 0, 0);
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'blue';
	ctx.strokeText(text, 0, 0);

}

function drawText(canvas, text, x, y, maxWidth, lineHeight, fontFamily, fontSize, fontStyle){
	var ctx = canvas.getContext('2d');
	
	ctx.globalCompositeOperation = "source-over";
	ctx.font = fontStyle + ' ' + fontSize + ' ' + fontFamily;
	ctx.fillStyle = 'green';
	ctx.textBaseline = 'top';
	// ctx.fillText(text, 0, 0);

	var words = text.split(' ');
    var line = '';

    var count = 0;
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var testLineMetrics = ctx.measureText(testLine);
      var testLineWidth = testLineMetrics.width;

      if (!count) {
      	//the first line, should consider startingPointX
		if (testLineWidth + x > maxWidth && n > 0) {
			// 	draw the underline
			console.log(line);
			var lineMetrics = ctx.measureText(line);
      		var lineWidth = lineMetrics.width;
			ctx.globalCompositeOperation = "source-over";
			var posY = 24 * 0.9;
			var strokeWidth = 1;

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
			ctx.lineWidth = 4;
			ctx.strokeStyle = 'blue';
			ctx.strokeText(line, x, y);

			line = words[n] + ' ';
			y += lineHeight;
      		count++;
		} else {
			line = testLine;
		}
      } else {
		if (testLineWidth > maxWidth && n > 0) {
			// 	draw the underline
			console.log(line);
			var lineMetrics = ctx.measureText(line);
      		var lineWidth = lineMetrics.width;

			ctx.globalCompositeOperation = "source-over";
			var posY = 24 * 0.9;
			var strokeWidth = 1;

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
			ctx.lineWidth = 4;
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
	console.log(line);
	var lineMetrics = ctx.measureText(line);
	var lineWidth = lineMetrics.width;
	ctx.globalCompositeOperation = "source-over";
	var posY = 24 * 0.9;
	var strokeWidth = 1;

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
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'blue';
	ctx.strokeText(line, 0, y);

}
$(function(){
	$('.underline').each(function(){
		$this = $(this)[0];
		// step 1, single line or multiple line?
		var lineHeight = parseFloat(window.getComputedStyle($this, null)
				.getPropertyValue("line-height"));
		var fontFamily = window.getComputedStyle($(this)[0], null)
				.getPropertyValue("font-family");
		var fontSize = window.getComputedStyle($(this)[0], null)
				.getPropertyValue("font-size");
		var fontStyle = window.getComputedStyle($(this)[0], null)
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

		var text = $this.textContent;
		// console.log(text);

		$this.appendChild(canvas);
		if (height > lineHeight) {
			// multiple lines
			console.log("multiple lines");

			var offsetLeft = $this.offsetLeft;
			var parentOffsetLeft = $this.parentNode.offsetLeft;
			var canvasLeft = parentOffsetLeft - offsetLeft;
			var startPointX = offsetLeft - parentOffsetLeft;
			var startPointY = 0;
			canvas.style.left= canvasLeft + 'px';
			console.log(lineHeight);
			drawText(canvas, text, startPointX, startPointY, maxWidth, 
				lineHeight, fontFamily, fontSize, fontStyle);

		} else {
			// single line
			console.log("single line");
			drawTextSingleLine (canvas, text, fontFamily, fontSize, fontStyle)
		}
	})
})