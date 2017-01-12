/*
 * Note: suggestions state to use epoch time for additional information
 */
var Keys = function() {
    this._pressed = {};
}

Keys.prototype.isDown = function(keyCode) {
    return this._pressed[keyCode];
}

Keys.prototype.copy = function(keys) {
	this._pressed = keys._pressed;
}

Keys.SPACE = 32;
Keys.ENTER = 13;
Keys.TAB = 9;
Keys.ESC = 27;
Keys.BACKSPACE = 8;
Keys.SHIFT = 16;
Keys.CTRL = 17;
Keys.ALT = 18;

Keys.LEFT = 37;
Keys.UP = 38;
Keys.RIGHT = 39;
Keys.DOWN = 40;

Keys.W = 87;
Keys.A = 65;
Keys.S = 83;
Keys.D = 68;
Keys.Z = 90;

module.exports = Keys;