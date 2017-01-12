
/**
 * @summary Game over screen for the game (covers entire screen)
 *
 * @class
 * @augments UIRectangle,Rectangle
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {number} x - coordinate for the menu portion of the game over screen.
 * @param {number} y - coordinate for the menu portion of the game over screen.
 * @param {number} width - size for the menu portion of the game over screen.
 * @param {number} height - size for the menu portion of the game over screen.
 */
var GameOverScreen = function(canvas,x,y,width,height) {
    UIRectangle.call(this,0,0,canvas.width,canvas.height);
    this._text = [];
    this._text[0] = "You were killed by:";
    this._text[2] = "as";
    this._text[4] = "with";
    this.border = 10;
    this.menu = new UIRectangle(x,y,width,height);
    this.menu.fillStyle = "rgba(70,200,150,0.8)";
    this._createButton(canvas, function() {
        engine.startScreen.show();
        engine.gameOverScreen.hide();
    });
    this.fillStyle = "rgba(100,100,100,0.6)";
    this.fontSize = 40;
    var screen = this;
    this.resize(canvas);
    this.hide();
}

GameOverScreen.prototype = Object.create(UIRectangle.prototype);
GameOverScreen.prototype.constructor = GameOverScreen;
GameOverScreen._super = Object.getPrototypeOf(GameOverScreen.prototype);

/**
 * @summary Hides the game over screen
 */
GameOverScreen.prototype.hide = function() {
    this.hidden = true;
    this.button.style.display = "none";
}

/**
 * @summary Shows the game over screen
 */
GameOverScreen.prototype.show = function() {
    var player = engine.player;
    this._text[1] = player.killer;
    this._text[3] = player.text;
    this._text[5] = player.points + " points";
    this._text[6] = "in " + ordinal_suffix_of(engine.leaderboard.getPlaceOf(engine.player)) + " place";
    this.button.style.display = "";
    this.hidden = false;
    console.log("game over show: ", this._text);
}

/**
 * @summary Draws the game over screen
 *
 * @param {Object} canvas - HTML5 Canvas's context2D.
 */
GameOverScreen.prototype.draw = function(canvas) {
    if (this.hidden) return;
    GameOverScreen._super.draw.call(this,canvas);
    this.menu.draw(canvas);
    var x = this.centerX();
    var y = this.centerY() - this.menu.height / 2 + this.border;
    var offset = (this.menu.height - this.border * 2) / (this._text.length + 1);
    for (var i = 0; i < this._text.length; i++) {
        this.drawText(canvas,this._text[i],x,y);
        y += offset;
    }
}

/**
 * @summary Resizes the game over screen and associated components
 *
 * @param {Object} canvas - HTML5 Canvas.
 */
GameOverScreen.prototype.resize = function(canvas) {
    this.set(0,0,canvas.width,canvas.height);
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var screenW = this.menu.width;
    var screenH = this.menu.height;
    var screenX = (canvasW - screenW)/2;
    var screenY = (canvasH - screenH)/2;
    this.menu.set(screenX,screenY,screenW,screenH);
    this.setButton(canvas);
}

/**
 * @summary Create Button for this game over screen
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {function} eventlistener - button eventlistener function.
 * @param {number} x - coordinate for the button of the game over screen.
 * @param {number} y - coordinate for the button of the game over screen.
 * @param {number} width - size for the button.
 * @param {number} height - size for the button.
 * @param {number} zIndex - zIndex for the button.
 * @return {Object} button - HTML button created for this screen.
 */
GameOverScreen.prototype._createButton = function(canvas,funct,x,y,w,h,zIndex) {
    this.button = document.createElement('button'); // Create a <button> element
    var t = document.createTextNode("RETRY");       // Create a text node
    this.button.appendChild(t);                          // Append the text to <button>
    this.button.style.position = "absolute";
    this.setButton(canvas,x,y,w,h,zIndex);
    this.button.addEventListener('mouseup', funct);
    this.button.addEventListener('keyup', funct);
    document.getElementById("overlay").appendChild(this.button);
    return this.button;
}

/**
 * @summary Moves button, does not effectively support the parameters due to resizing issues
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {number} x - coordinate for the button of the game over screen.
 * @param {number} y - coordinate for the button of the game over screen.
 * @param {number} width - size for the button.
 * @param {number} height - size for the button.
 * @param {number} zIndex - zIndex for the button.
 * @return {Object} button - HTML button created for this screen.
 */
GameOverScreen.prototype.setButton = function(canvas,x,y,w,h,zIndex) {
    this.button.style.zIndex = zIndex || 2;
    w = w || Math.floor(this.menu.width/2);
    h = h || Math.floor(this.menu.fontSize);
    var size = {x:w,y:h};
    size = setElementSize(canvas,this.button,size,true);
    // var size = toClientPos(canvas,{x:w,y:h},true);
    // w = size.x;
    // h = size.y;
    // this.button.style.width  = w + "px";
    h = size.y * 2;
    this.button.style.height = h + "px";
    // this.button.style.fontSize = h + "px";
    var offset = (this.menu.height - this.border * 2) / (this._text.length + 1);
    var position = {x:this.centerX(),y:this.centerY() + this.menu.height / 2 - offset + h / 2};
    position = setElementPosition(canvas,this.button,position,size);
    // var bounds = toClientPos(canvas,);
    // x = x || (bounds.x - w/2);
    // y = y || (bounds.y - h/2);
    // this.button.style.left = x + "px";
    // this.button.style.top = y + "px";
    return this.button;
}