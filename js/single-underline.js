var multiplyValue = function(value, multiplier){
    var str = value;
    var m = multiplier;
    var result = str.match(/(\d*\.?\d*)(.*)/);
    //http://stackoverflow.com/questions/2868947/split1px-into-1px-1-px-in-javascript
    return result[1] * m + result[2];
}

var optimalStrokeWidthPos = function(strokeWidth, posY){
    if ( strokeWidth < 1) {
        posY = Math.round(posY - 0.5) + 0.5;
    } else if ( strokeWidth >= 1 ) {
        strokeWidth = Math.round( strokeWidth );
        if ( strokeWidth % 2 ){
            // odd, posY -> 0.5
            posY = Math.round(posY - 0.5) + 0.5;
        } else {
            // even, posY -> 1
            posY = Math.round(posY);
        }
    }
    return {
        strokeWidth: strokeWidth,
        posY: posY
    }
}

function SingleUnderline(element, underlineStyles, elementStyles) {
    //ctor
    this.element = element;

    this.text = this.element.textContent;

    this.underlineStyles = underlineStyles;

    this.elementStyles = elementStyles;
    this.redrawActive = false;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext('2d');
    
    this.ratio = window.devicePixelRatio;
        this.canvas.width = this.elementStyles.width*this.ratio;
        this.canvas.height = this.elementStyles.height*this.ratio;
        this.element.appendChild(this.canvas);
        this.canvas.style.width =  this.elementStyles.width + 'px';

        this.ctx.font = this.font = this.elementStyles.fontStyle + ' ' 
                        + multiplyValue(this.elementStyles.fontSize, this.ratio) + ' ' 
                        + this.elementStyles.fontFamily;

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
        // console.log(this.elementStyles.baselinePositionRatio);
        this.underlinePosition = parseFloat(this.elementStyles.height) * this.ratio 
                * ( 1 - this.elementStyles.baselinePositionRatio + 
                    this.elementStyles.baselinePositionRatio * 0.4)
                + this.strokeWidth/2;
    } else {
        //if set to ratio value, todo: other unit such as em, px?
        var userUnderlinePosition = parseFloat(this.underlineStyles['text-underline-position']);
        // console.log(this.elementStyles.baselinePositionRatio);
        this.underlinePosition = parseFloat(this.elementStyles.height) * this.ratio * 
                ( 1 - this.elementStyles.baselinePositionRatio + 
                    this.elementStyles.baselinePositionRatio * userUnderlinePosition)
                + this.strokeWidth/2;
    }

    var adjustValue = optimalStrokeWidthPos(this.strokeWidth, this.underlinePosition);
    this.strokeWidth = adjustValue.strokeWidth;
    this.underlinePosition = adjustValue.posY;

    // todo: if last character is a space, remove the space
    textWidth = this.ctx.measureText(this.text).width;

    this.myString = new GuitarString(this.ctx, 
        new Point(0, this.underlinePosition), 
        new Point(textWidth, this.underlinePosition), 
        this.strokeWidth, this.underlineStyles['text-underline-color'], this.ratio);
    this.drawHoles();

}

SingleUnderline.prototype.drawUnderline = function(){
    //  draw the underline
    this.myString.draw();
}

SingleUnderline.prototype.drawHoles = function(){
    // draw the font stroke             
    this.ctx.font = this.font;
    this.ctx.textBaseline = 'top';

    this.ctx.globalCompositeOperation = "destination-out";   

    this.ctx.lineWidth = 2*this.ratio + this.strokeWidth*3.6;
    this.ctx.strokeStyle = 'blue';
    this.ctx.beginPath();
    this.ctx.strokeText(this.text, -0.2, 0);  

    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.fillText(this.text, -0.2, 0);
}

SingleUnderline.prototype.clear = function(){
    this.redrawActive = this.myString.redrawActive;
    // clear
    if(this.myString.redrawActive) {
        // this.myString.clear();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};


SingleUnderline.prototype.update = function(){
    // update
    if(this.myString.redrawActive) {
        this.myString.update();
    }
};


SingleUnderline.prototype.draw = function(){
    // draw
    if(this.redrawActive) {
        this.drawUnderline();
        this.drawHoles();
    }
};


