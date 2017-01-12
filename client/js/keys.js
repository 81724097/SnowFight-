/*
 * Note: suggestions state to use epoch time for additional information
 */
var Keys = {
    _pressed: {},

    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    BACKSPACE: 8,

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    
    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },
    
    onKeydown: function(e) {
        this._pressed[e.keyCode] = true;
    },
    
    onKeyup: function(e) {
        delete this._pressed[e.keyCode];
    }
};