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

function SingleUnderline(element, underlineStyles, elementStyles) {
    //ctor
    this.element = element;

    this.text = this.element.textContent;

    this.underlineStyles = underlineStyles;

    // this.elementStyles = getElementStyles(element);
    this.elementStyles = elementStyles;

    this.canvas = document.createElement("canvas");
        this.canvas.width = this.elementStyles.width;
        this.canvas.height = this.elementStyles.height;
        this.element.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
        this.ctx.font = this.font = this.elementStyles.fontStyle + ' ' 
                        + this.elementStyles.fontSize + ' ' 
                        + this.elementStyles.fontFamily;

    // determine the text-underline-width / strokeWidth
    this.dotWidth = this.ctx.measureText('.')['width'];
    if (this.underlineStyles['text-underline-width'] == "auto") {
        // if set to auto, calculate the optimized width based on font
        if (this.dotWidth/6 <= 2) {
            this.strokeWidth = Math.round( this.dotWidth/3 )/2;
        } else {
            this.strokeWidth = Math.round( this.dotWidth/6 );
        }
    } else {
        //if set to px value
        this.strokeWidth = this.underlineStyles['text-underline-width'];
        //get number value
        this.strokeWidth = parseFloat(this.strokeWidth);
    }

    // determine the text-underline-position / underlinePosition
    // text-underline-position in ratio
    this.underlinePosition = parseFloat(this.elementStyles.height) * 
            (1 - this.elementStyles.baselinePositionRatio 
                + this.underlineStyles['text-underline-position']);

    if(this.strokeWidth <= 1 || (this.strokeWidth%2 && this.strokeWidth > 2)) {
        this.underlinePosition = Math.round(this.underlinePosition - 0.5) + 0.5;
    } else {
        this.underlinePosition = Math.round(this.underlinePosition);
    }

    this.textWidth = this.ctx.measureText(this.text).width;

    this.myString = new GuitarString(this.ctx, 
        new Point(0, this.underlinePosition), 
        new Point(this.textWidth, this.underlinePosition), 
        this.strokeWidth, this.underlineStyles['text-underline-color']);

}


SingleUnderline.prototype.update = function(){
    // update
    this.myString.update();
};

SingleUnderline.prototype.clear = function(){
    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

};


SingleUnderline.prototype.draw = function(){
    // draw
    this.drawUnderline();
    this.drawHoles();
};

SingleUnderline.prototype.drawUnderline = function(){
    //  draw the underline
    // console.log(text);
    this.ctx.font = this.font;
    this.ctx.textBaseline = 'top';

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.strokeStyle = this.underlineStyles['text-underline-color'];
    this.ctx.lineWidth = this.strokeWidth;

    // this.ctx.beginPath();
    // this.ctx.moveTo(0, this.underlinePosition);
    // this.ctx.lineTo(this.textWidth, this.underlinePosition);
    // this.ctx.stroke();
    this.myString.draw();
}

SingleUnderline.prototype.drawHoles = function(){
    
    // draw the font stroke             
    this.ctx.font = this.font;
    this.ctx.textBaseline = 'top';

    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillStyle = 'green';
    this.ctx.fillText(this.text, 0, 0);
    this.ctx.lineWidth = 3 + this.strokeWidth;
    this.ctx.strokeStyle = 'blue';
    this.ctx.strokeText(this.text, 0, 0);
}


function MultipleUnderline(element, underlineStyles, elementStyles) {
    //ctor
    this.element = element;

    this.text = this.element.textContent;

    this.underlineStyles = underlineStyles;

    // this.elementStyles = getElementStyles(element);
    this.elementStyles = elementStyles;

    this.canvas = document.createElement("canvas");
        this.canvas.width = this.elementStyles.width;
        this.canvas.height = this.elementStyles.height;
        this.canvas.style.left= this.elementStyles.canvasLeft + 'px';
        this.element.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
        this.ctx.font = this.font = this.elementStyles.fontStyle + ' ' 
                        + this.elementStyles.fontSize + ' ' 
                        + this.elementStyles.fontFamily;


    if (is_chrome) {
        // chrome floor the lineheight when it is not a whole number
        this.elementStyles.lineHeight = Math.floor(this.elementStyles.lineHeight);
    }


    // determine the text-underline-width / strokeWidth
    this.dotWidth = this.ctx.measureText('.')['width'];
    if (this.underlineStyles['text-underline-width'] == "auto") {
        // if set to auto, calculate the optimized width based on font
        if (this.dotWidth/6 <= 2) {
            this.strokeWidth = Math.round( this.dotWidth/3 )/2;
        } else {
            this.strokeWidth = Math.round( this.dotWidth/6 );
        }
    } else {
        //if set to px value
        this.strokeWidth = this.underlineStyles['text-underline-width'];
        //get number value
        this.strokeWidth = parseFloat(this.strokeWidth);
    }

    // determine the text-underline-position / underlinePosition
    // text-underline-position in ratio
    this.underlinePosition = parseFloat(this.elementStyles.fontSize) * 0.89;
    if(this.strokeWidth <= 1 || (this.strokeWidth%2 && this.strokeWidth > 2)) {
        this.underlinePosition = Math.round(this.underlinePosition - 0.5) + 0.5;
    } else {
        this.underlinePosition = Math.round(this.underlinePosition);
    }

}

MultipleUnderline.prototype.update = function(){
    // update
    // var words = this.text.split(' ');

    var words = this.text.match(/[^\s-]+-?\s?/g);
    var line = '';

    var linePositionY = 0;
    var firstLineCount = 0;
    for(var n = 0; n < words.length; n++) {
        // add the whitespace after getting the width measurement
        if ( words[n].match(/\s+$/) ) {
            // the last character of words[n] is whitespace
            var newWord = words[n].replace(/\s+$/, '');
            var testLine = line + newWord;
            var testLineMetrics = this.ctx.measureText(testLine);
            var testLineWidth = testLineMetrics.width;
            testLine = testLine + ' ';
        } else {  
            var testLine = line + words[n];
            var testLineMetrics = this.ctx.measureText(testLine);
            var testLineWidth = testLineMetrics.width;
        }

      if (!firstLineCount) {
        //the first line, should consider startingPointX
        if (testLineWidth + this.elementStyles.textIndent > this.elementStyles.parentWidth && n > 0) {
            //  draw the underline
            if ( line.match(/\s+$/) ) {
                // the last character of line is whitespace               
                var lineMetrics = this.ctx.measureText(line.replace(/\s+$/, ''));
                var lineWidth = lineMetrics.width; 
            } else {
                var lineMetrics = this.ctx.measureText(line);
                var lineWidth = lineMetrics.width; 
            }

            this.ctx.globalCompositeOperation = "source-over";

            this.ctx.strokeStyle = this.underlineStyles['text-underline-color'];
            this.ctx.lineWidth = this.strokeWidth;

            this.ctx.beginPath();
            this.ctx.moveTo(this.elementStyles.textIndent, this.underlinePosition);
            this.ctx.lineTo(lineWidth + this.elementStyles.textIndent , this.underlinePosition);
            this.ctx.stroke();

            // draw the font stroke

            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.font = this.font;
            this.ctx.fillStyle = 'green';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(line, this.elementStyles.textIndent, linePositionY);
            this.ctx.lineWidth = 3 + this.strokeWidth;
            this.ctx.strokeStyle = 'blue';
            this.ctx.strokeText(line, this.elementStyles.textIndent, linePositionY);

            line = words[n];
            linePositionY += this.elementStyles.lineHeight;
            firstLineCount++;
        } else {
            line = testLine;
        }
      } else {
        if (testLineWidth > this.elementStyles.parentWidth && n > 0) {
            //  draw the underline
            if ( line.match(/\s+$/) ) {
                // the last character of line is whitespace               
                var lineMetrics = this.ctx.measureText(line.replace(/\s+$/, ''));
                var lineWidth = lineMetrics.width; 
            } else {
                var lineMetrics = this.ctx.measureText(line);
                var lineWidth = lineMetrics.width; 
            }

            this.ctx.globalCompositeOperation = "source-over";

            this.ctx.strokeStyle = 'orangered';
            this.ctx.lineWidth = this.strokeWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(0, linePositionY + this.underlinePosition);
            this.ctx.lineTo(lineWidth , linePositionY + this.underlinePosition);
            this.ctx.stroke();

            // draw the font stroke
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.font = this.font;
            this.ctx.fillStyle = 'green';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(line, 0, linePositionY);
            this.ctx.lineWidth = 3 + this.strokeWidth;
            this.ctx.strokeStyle = 'blue';
            this.ctx.strokeText(line, 0, linePositionY);

            line = words[n];
            linePositionY += this.elementStyles.lineHeight;
        } else {
            line = testLine;
        }
      }
    }
    // draw the last line
    //  draw the underline
    if ( line.match(/\s+$/) ) {
        // the last character of line is whitespace               
        var lineMetrics = this.ctx.measureText(line.replace(/\s+$/, ''));
        var lineWidth = lineMetrics.width; 
    } else {
        var lineMetrics = this.ctx.measureText(line);
        var lineWidth = lineMetrics.width; 
    }
    this.ctx.globalCompositeOperation = "source-over";

    this.ctx.strokeStyle = 'orangered';
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(0, linePositionY + this.underlinePosition);
    this.ctx.lineTo(lineWidth , linePositionY + this.underlinePosition);
    this.ctx.stroke();

    // draw the font stroke
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.font = this.font;
    this.ctx.fillStyle = 'green';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(line, 0, linePositionY);
    this.ctx.lineWidth = 3 + this.strokeWidth;
    this.ctx.strokeStyle = 'blue';
    this.ctx.strokeText(line, 0, linePositionY);
};

MultipleUnderline.prototype.clear = function(){
    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

};

MultipleUnderline.prototype.draw = function(){
    // draw
};

