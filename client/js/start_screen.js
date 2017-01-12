
/**
 * @summary Start screen for the game (covers entire screen)
 *
 * @class
 * @augments UIRectangle,Rectangle
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {number} x - coordinate for the menu portion of the start screen.
 * @param {number} y - coordinate for the menu portion of the start screen.
 * @param {number} width - size for the menu portion of the start screen.
 * @param {number} height - size for the menu portion of the start screen.
 */
var StartScreen = function(canvas,x,y,width,height,controls) {
	UIRectangle.call(this,0,0,canvas.width,canvas.height);
	this.text = "Snowfight.io";
	this.fillStyle = "rgba(100,100,100,0.6)";
	this.fontSize = 50;
	var screen = this;
	this.menu = new UIRectangle(x,y,width,height);
	this.menu.fillStyle = "rgba(50,200,130,1.0)";
	this._createButtons(canvas);
	this._createTextbox(canvas,function(e) {
		console.log("textkeys: " + e.keyCode);
		if (e.keyCode === Keys.ENTER) {
			screen.startGame();
		}
	});
	this.controls = controls;
	this.resize(canvas);
}

StartScreen.prototype = Object.create(UIRectangle.prototype);
StartScreen.prototype.constructor = StartScreen;
StartScreen._super = Object.getPrototypeOf(StartScreen.prototype);

/**
 * @summary Hides the start screen
 */
StartScreen.prototype.hide = function() {
	this.hidden = true;
	this.textbox.style.display = "none";
	this.textbox.blur();
	this.playButton.style.display = "none";
	this.moreButton.style.display = "none";
}

/**
 * @summary Shows the start screen
 */
StartScreen.prototype.show = function() {
	this.hidden = false;
	this.textbox.style.display = "";
	this.textbox.focus();
	this.playButton.style.display = "";
	this.moreButton.style.display = "";
}

/**
 * @summary Draws the start screen
 *
 * @param {Object} canvas - HTML5 Canvas's context2D.
 */
StartScreen.prototype.draw = function(canvas) {
	if (this.hidden) return;
	StartScreen._super.draw.call(this,canvas);
	this.menu.draw(canvas);
	this.drawText(canvas,this.text,this.centerX(),this.centerY() - this.menu.height / 3);
	this.controls.draw(canvas);
}

/**
 * @summary Resizes the start screen and associated components
 *
 * @param {Object} canvas - HTML5 Canvas.
 */
StartScreen.prototype.resize = function(canvas) {
	this.set(0,0,canvas.width,canvas.height);
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var screenW = this.menu.width;
    var screenH = this.menu.height;
    var screenX = (canvasW - screenW)/2;
    var screenY = (canvasH - screenH)/2;
    this.menu.set(screenX,screenY);
	this.setTextbox(canvas);
	this.controls.resize(canvas);
	this.setButtons(canvas);
}

/**
 * @summary Create Textbox for this start screen
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {function} eventlistener - textbox eventlistener function.
 * @param {number} x - coordinate for the menu portion of the start screen.
 * @param {number} y - coordinate for the menu portion of the start screen.
 * @param {number} width - size for the textbox.
 * @param {number} height - size for the textbox.
 * @param {number} zIndex - zIndex for the textbox.
 * @return {Object} textbox - HTML textbox created for this screen.
 */
StartScreen.prototype._createTextbox = function(canvas,funct,x,y,w,h,zIndex) {
	this.textbox = document.createElement('input');
	this.textbox.placeholder = "Nickname";
	this.textbox.style.position = "absolute";
	this.setTextbox(canvas,x,y,w,h,zIndex);
	this.textbox.addEventListener('keyup', funct);
	document.getElementById("overlay").appendChild(this.textbox);
	return this.textbox;
}

/**
 * @summary Moves textbox, does not effectively support the parameters due to resizing issues
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {number} x - coordinate for the menu portion of the start screen.
 * @param {number} y - coordinate for the menu portion of the start screen.
 * @param {number} width - size for the textbox.
 * @param {number} height - size for the textbox.
 * @param {number} zIndex - zIndex for the textbox.
 * @return {Object} textbox - HTML textbox created for this screen.
 */
StartScreen.prototype.setTextbox = function(canvas,x,y,w,h,zIndex) {
	this.textbox.style.zIndex = zIndex || 2;
	w = w || Math.floor(this.menu.width/2);
	h = h || Math.floor(this.menu.fontSize);
	var size = toClientPos(canvas,{x:w,y:h},true);
	w = size.x;
	h = size.y;
	this.textbox.style.width  = w + "px";
	this.textbox.style.height = h + "px";
	this.textbox.style.fontSize = h + "px";
	var bounds = toClientPos(canvas,{x:this.centerX(),y:this.centerY()});
	x = x || (bounds.x - w/2);
	y = y || (bounds.y - h/2);
	this.textbox.style.left = x + "px";
	this.textbox.style.top = y + "px";
	return this.textbox;
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
var createButton = function(canvas,text,funct) {
    button = document.createElement('button'); // Create a <button> element
    var t = document.createTextNode(text);     // Create a text node
    button.appendChild(t);                     // Append the text to <button>
    button.style.position = "absolute";
    button.addEventListener('click', funct);
    document.getElementById("overlay").appendChild(button);
    return button;
}
StartScreen.prototype.startGame = function() {
	socket.emit('name', this.textbox.value);
	screen.hide();
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
StartScreen.prototype._createButtons = function(canvas) {
	var screen = this;
    this.playButton = createButton(canvas,"PLAY",function() {
    	screen.startGame();
    });
    this.moreButton = createButton(canvas,"MORE IO GAMES",function() {
    	window.open('http://iogames.space/','_blank').focus();
    })
    this.setButtons(canvas);
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
StartScreen.prototype.setButton = function(canvas,button,x,y,w,h,zIndex) {
    button.style.zIndex = zIndex || 2;
    w = w || Math.floor(this.menu.width/2);
    h = h || Math.floor(this.menu.fontSize);
    var size = {x:w,y:h};
    size = setElementSize(canvas,button,size,true);
    h = size.y * 2; // for this screen only, double the button heights
    button.style.height = h + "px";
    var position = {x:x,y:y};
    position = setElementPosition(canvas,button,position,size);
    return button;
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
StartScreen.prototype.setButtons = function(canvas,x,y,w,h,zIndex) {
	var offset = this.menu.fontSize * 3;
	w = w || Math.floor(this.menu.width/2);
	h = h || Math.floor(this.menu.fontSize);
	this.setButton(canvas,this.playButton,this.centerX(),this.centerY() + offset,w,h);
	this.setButton(canvas,this.moreButton,this.centerX(),this.centerY() + offset*2,w,h);
}