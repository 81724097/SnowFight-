/**
 * Extending the UIObject from ui_base.js, this represents a button that can support both mouse and keyboard input
 * set keyHandler to a function in order to support keys
 * set array properties of handler[] to functions to support mouse buttons: 0 = left, 1 = middle, 2 = right
 */
var Button = function(x, y, radius) {
    UIObject.call(this,x,y,radius);
    this.clicked = [false, false, false];
    this.hovered = false;
    this.handler = new Array(NUM_MOUSE_BUTTONS);
    // default colors/text options
    this.hoverColor = "rgb(80, 180, 150)";
    this.fillColor = "rgb(50, 150, 130)";
    this.fontSize = 20;
    this.fontFamily = "Hanken Round";
    this.textColor = "rgb(255, 255, 255)";
}
 
Button.prototype = Object.create(UIObject.prototype);
Button.prototype.constructor = Button;

Button.prototype.update = function(mouse) {
    var wasNotClicked = [false, false, false];
    for (var i = 0; i < NUM_MOUSE_BUTTONS; i++) {
        wasNotClicked[i] = !this.clicked[i];
    }
    this.updateStats(mouse);

    for (var i = 0; i < NUM_MOUSE_BUTTONS; i++) {
        if (this.handler[i] && this.clicked[i] && wasNotClicked[i]) { // only if just clicked call handler
            this.handler[i](); // call handler here
        }
    }
    if (typeof this.keyHandler === "function")
    {
    	this.keyHandler();
    }
}

Button.prototype.draw = function(canvas) {
	if ( this.image )
	{
	    var img = this.hovered && this.hoverImage ? this.hoverImage : this.image; // choose an image
        var imageX = this.leftSide() - img.width + this.radius * 2;
        var imageY = this.topSide() - img.height + this.radius * 2;
	    canvas.drawImage(img,imageX,imageY); // draw button
	}
	else
	{
	    var style = this.hovered && this.hoverColor ? this.hoverColor : this.fillColor; // set color
        Circle.fill(canvas,this,style);
        if ( this.strokeStyle )
        {
            Circle.stroke(canvas,this,this.strokeStyle,this.strokeWidth);
        }
	}
    this.drawText(canvas);
}

Button.prototype.drawText = function(canvas) {
    if ( this.text )
    {
        //text options
        canvas.fillStyle = this.textColor;
        canvas.strokeStyle = "rgb(50,50,50)";
        canvas.lineWidth = 1;
        canvas.font = 800 + " " + this.fontSize + "px " + this.fontFamily;
     
        //text position
        // var textSize = canvas.measureText(this.text);
        var textX = this.textX || this._textX || this.x; // - (textSize.width / 2);
        var textY = this.textY || this._textY || this.y;// - (fontSize/2);
        canvas.textAlign = this.textAlign || "center";
        canvas.textBaseline = this.textBaseline || "middle";
        //draw the text
        canvas.fillText(this.text, textX, textY);
        canvas.strokeText(this.text, textX, textY);
    }
}