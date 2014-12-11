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

    return {
        lineHeight: lineHeight,
        width: width,
        height: height,
        parentWidth: parentWidth,
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontStyle: fontStyle,
        baselinePositionRatio: baselinePositionRatio
    }
};



function SingleUnderline(element, underlineStyles) {
    //ctor
    this.element = element;

    this.text = this.element.textContent;

    this.underlineStyles = underlineStyles;

    this.styles = getElementStyles(element);

    this.canvas = document.createElement("canvas");
        this.canvas.width = this.styles.width;
        this.canvas.height = this.styles.height;
        this.element.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
        this.ctx.font = this.font = this.styles.fontStyle + ' ' 
                        + this.styles.fontSize + ' ' 
                        + this.styles.fontFamily;

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
    this.underlinePosition = parseFloat(this.styles.height) * 
            (1 - this.styles.baselinePositionRatio 
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