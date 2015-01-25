
function MultipleUnderline(element, underlineStyles, elementStyles) {
    //ctor
    this.element = element;

    this.text = this.element.textContent;

    this.underlineStyles = underlineStyles;

    // this.elementStyles = getElementStyles(element);
    this.elementStyles = elementStyles;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext('2d');


    this.ratio = window.devicePixelRatio;
        this.canvas.width = this.elementStyles.width*this.ratio;
        this.canvas.height = this.elementStyles.height*this.ratio;
        // this.canvas.height = this.canvas.clientHeight + this.elementStyles.lineHeight;
        this.canvas.style.left = this.elementStyles.canvasLeft + 'px';
        this.element.appendChild(this.canvas);
        this.canvas.style.width =  this.elementStyles.width + 'px';

        this.ctx.font = this.font = this.elementStyles.fontStyle + ' ' 
                        + multiplyValue(this.elementStyles.fontSize, this.ratio) + ' ' 
                        + this.elementStyles.fontFamily;

    this.multipleRedrawActive = false;
    if (is_chrome) {
        // chrome floor the lineheight when it is not a whole number
        // this.elementStyles.lineHeight = Math.floor(this.elementStyles.lineHeight * this.ratio);
        this.elementStyles.lineHeight = this.elementStyles.lineHeight * this.ratio;
    } else {
        this.elementStyles.lineHeight = this.elementStyles.lineHeight * this.ratio;
    }

    // determine the text-underline-width / strokeWidth
    var dotWidth = this.ctx.measureText('.')['width'];
    if (this.underlineStyles['text-underline-width'] == "auto") {
        // if set to auto, calculate the optimized width based on font
        this.strokeWidth = dotWidth/12;
    } else {
        //if set to px value, todo: other unit such as em?
        this.strokeWidth = this.underlineStyles['text-underline-width'];
        //get number value
        this.strokeWidth = parseFloat(this.strokeWidth)*this.ratio;
    }

    // determine the text-underline-position / underlinePosition
    // text-underline-position in ratio, todo: default and user set position ratio
    if (this.underlineStyles['text-underline-position'] == "auto") {
        // if set to auto, calculate the optimized width based on font
        this.underlinePosition = parseFloat(this.elementStyles.fontSize) * this.ratio 
                * ( 1 - this.elementStyles.baselinePositionRatio + 
                    this.elementStyles.baselinePositionRatio * 0.4)
                + this.strokeWidth/2;
    } else {
        //if set to ratio value, todo: other unit such as em, px?
        var userUnderlinePosition = parseFloat(this.underlineStyles['text-underline-position']);
        // console.log(userUnderlinePosition);
        this.underlinePosition = parseFloat(this.elementStyles.fontSize) * this.ratio * 
                ( 1 - this.elementStyles.baselinePositionRatio + 
                    this.elementStyles.baselinePositionRatio * userUnderlinePosition)
                + this.strokeWidth/2;
    }


    var adjustValue = optimalStrokeWidthPos(this.strokeWidth, this.underlinePosition);
    this.strokeWidth = adjustValue.strokeWidth;
    this.underlinePosition = adjustValue.posY;

    this.lines = [];
    this.myStrings = [];

    var words = this.text.match(/[^\s-]+-?\s?/g);
    var line = '';

    var linePositionY = 0;
    var firstLineCount = 0;
    for (var n = 0; n < words.length; n++) {
        // add the whitespace after getting the width measurement
        if (words[n].match(/\s+$/)) {
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
            if (testLineWidth + this.elementStyles.textIndent * this.ratio > this.elementStyles.parentWidth * this.ratio && n > 0) {
                //  draw the underline
                if (line.match(/\s+$/)) {
                    // the last character of line is whitespace               
                    var lineMetrics = this.ctx.measureText(line.replace(/\s+$/, ''));
                    var lineWidth = lineMetrics.width;
                } else {
                    var lineMetrics = this.ctx.measureText(line);
                    var lineWidth = lineMetrics.width;
                }

                var tempLine = {
                    lineText: line,
                    lineTextIndent: this.elementStyles.textIndent * this.ratio - 0.2,
                    linePositionY: linePositionY,
                    lineMeasureWidth: lineWidth
                }
                this.lines.push(tempLine)

                line = words[n];
                linePositionY += this.elementStyles.lineHeight;
                firstLineCount++;
            } else {
                line = testLine;
            }
        } else {
            if (testLineWidth > this.elementStyles.parentWidth * this.ratio && n > 0) {
                //  draw the underline
                if (line.match(/\s+$/)) {
                    // the last character of line is whitespace               
                    var lineMetrics = this.ctx.measureText(line.replace(/\s+$/, ''));
                    var lineWidth = lineMetrics.width;
                } else {
                    var lineMetrics = this.ctx.measureText(line);
                    var lineWidth = lineMetrics.width;
                }

                var tempLine = {
                    lineText: line,
                    lineTextIndent: -0.2,
                    linePositionY: linePositionY,
                    lineMeasureWidth: lineWidth
                }
                this.lines.push(tempLine);

                line = words[n];
                linePositionY += this.elementStyles.lineHeight;
            } else {
                line = testLine;
            }
        }
    }
    // draw the last line
    //  draw the underline
    if (line.match(/\s+$/)) {
        // the last character of line is whitespace               
        var lineMetrics = this.ctx.measureText(line.replace(/\s+$/, ''));
        var lineWidth = lineMetrics.width;
    } else {
        var lineMetrics = this.ctx.measureText(line);
        var lineWidth = lineMetrics.width;
    }

    var tempLine = {
        lineText: line,
        lineTextIndent: -0.2,
        linePositionY: linePositionY,
        lineMeasureWidth: lineWidth
    }
    this.lines.push(tempLine);
    for(var i = 0; i < this.lines.length; i++) {
        var tempLine = this.lines[i];
        var myString = new GuitarString(
                this.ctx, 
                new Point(tempLine.lineTextIndent, tempLine.linePositionY + this.underlinePosition), 
                new Point(tempLine.lineTextIndent + tempLine.lineMeasureWidth, tempLine.linePositionY + this.underlinePosition), 
                this.strokeWidth, this.underlineStyles['text-underline-color'], this.ratio);
        this.myStrings.push(myString);
    }

    this.drawUnderline();
    this.drawHoles();

}

MultipleUnderline.prototype.drawUnderline = function(){
    // draw the underline
    for(var i = 0; i < this.myStrings.length; i++) {
        var tempString = this.myStrings[i];
        // tempString.clear();
            tempString.update();
            tempString.draw();
    }

};


MultipleUnderline.prototype.drawHoles = function(){
    // draw the font stroke
    for(var i = 0; i < this.lines.length; i++) {
        var tempLine = this.lines[i];

        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.font = this.font;

        this.ctx.fillStyle = 'green';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(tempLine.lineText, tempLine.lineTextIndent, tempLine.linePositionY);

        this.ctx.lineWidth = 2*this.ratio + this.strokeWidth*3.6;
        this.ctx.strokeStyle = 'blue';
        this.ctx.strokeText(tempLine.lineText, tempLine.lineTextIndent, tempLine.linePositionY);

    }
}

MultipleUnderline.prototype.clear = function(){
    // clear
    var lastMultipleRedrawActive = this.multipleRedrawActive;
    this.multipleRedrawActive = false;
    for(var i = 0; i < this.myStrings.length; i++) {
        var tempString = this.myStrings[i];
        // this.myString.clear();
        // console.log(tempString.redrawActive);
        if(tempString.redrawActive) {
            this.multipleRedrawActive = true;
        }
    }
    // console.log(this.multipleRedrawActive);
    if (this.multipleRedrawActive) {
        console.log('clear now!')
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // if (!lastMultipleRedrawActive && this.multipleRedrawActive) {
    //     for(var i = 0; i < this.myStrings.length; i++) {
    //         var tempString = this.myStrings[i];
    //         tempString.drawLine();
    //     }
    // }

};

MultipleUnderline.prototype.update = function(){
    //update
};


MultipleUnderline.prototype.draw = function(){
    // draw
    if (this.multipleRedrawActive) {
        this.drawUnderline();
        this.drawHoles();
    }
};


