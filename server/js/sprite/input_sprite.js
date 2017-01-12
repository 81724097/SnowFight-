
var Circle = require('./circle.js');
var Keys = require('../keys.js');

var NUM_MOUSE_BUTTONS = 3;

var InputSprite = function(x,y,radius) {
    Circle.call(this,x,y,radius);
    this.mouse = { 
        x: 0, 
        y: 0, 
        clicked: [false, false, false], 
        down: [false, false, false] 
    };
    this.keys = new Keys();
    this.clicked = [false, false, false];
    this.hovered = false;
    this.handler = new Array(NUM_MOUSE_BUTTONS);
}

InputSprite.prototype = Object.create(Circle.prototype);
InputSprite.prototype.constructor = InputSprite;

var NUM_MOUSE_BUTTONS = 3;

InputSprite.prototype.update = function() {
    for (var i = 0; i < NUM_MOUSE_BUTTONS; i++) {
        this.clicked[i] = this.mouse.down[i];
    }

    for (var i = 0; i < NUM_MOUSE_BUTTONS; i++) {
        if (this.handler[i] && this.clicked[i]) { // only if just clicked call handler
            this.handler[i].call(this); // call handler here
        }
    }
    if (typeof this.keyHandler === "function")
    {
        this.keyHandler();
    }
}

module.exports = InputSprite;