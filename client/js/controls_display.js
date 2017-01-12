
var _WORDS = ['or','= move', '= crouch', '= place wall', '= pick snow', '= shoot'];
var _OFFSETS = [20,70,80,120,80,80];

var ControlsDisplay = function(context2D,x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height; // probably can encompass this with Rectangle
    this.fontSize = 30;
    this.context2D = context2D;
    context2D.fontSize = this.fontSize; // for measuring text
    this.elements = new Array(_WORDS.length*2);

    for (var i = 0,j = 0,x = 0,y = 0; i < _WORDS.length; i++,j++) {
        x += CONTROL_IMAGES[i].naturalWidth;
        this.elements[j] = newTextSprite(x,y);
        this.elements[j].image = CONTROL_IMAGES[i];
        this.elements[j].fontSize = this.fontSize;
        j++;
        x += this.context2D.measureText(_WORDS[i]).width + 50;
        this.elements[j] = newTextSprite(x,y,_WORDS[i],'center','bottom');
        this.elements[j].textX = x;
        this.elements[j].textY = y;
        this.elements[j].fontSize = this.fontSize;
        x += _OFFSETS[i];
    }
    this.scaleX = this.width / x;
    this.scaleY = this.scaleX;
    this.resize(context2D.canvas);
}

/**
 * @summary Draws the start screen
 *
 * @param {Object} canvas - HTML5 Canvas's context2D.
 */
ControlsDisplay.prototype.draw = function(canvas) {
    canvas.save();
    canvas.translate(this.x,this.y);
    canvas.scale(this.scaleX,this.scaleY);
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].draw(canvas);
    }
    canvas.restore();
}

/**
 * @summary Resizes the start screen and associated components
 *
 * @param {Object} canvas - HTML5 Canvas.
 */
ControlsDisplay.prototype.resize = function(canvas) {
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var controlW = canvasW;
    var controlH = canvasH / 8;
    var controlX = 0;
    var controlY = canvasH - controlH / 2;
    this.x = controlX;
    this.y = controlY;
    this.width = controlW;
    this.height = controlH;
    this.context2D.fontSize = this.fontSize; // for measuring text

    for (var i = 0,j = 0,x = 0,y = 0; i < _WORDS.length; i++,j++) {
        x += CONTROL_IMAGES[i].naturalWidth;
        this.elements[j].set(x,y) ;
        j++;
        x += this.context2D.measureText(_WORDS[i]).width + 40;
        this.elements[j].textX = x;
        this.elements[j].textY = y;
        x += _OFFSETS[i] + 40;
    }
    this.scaleX = this.width / x;
    this.scaleY = this.scaleX;
}
