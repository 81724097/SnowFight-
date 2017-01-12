
/**
 * @summary Start screen for the game (covers entire screen)
 *
 * @class
 * @augments UIRectangle,Rectangle
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {number} x - coordinate for the menu portion of the chat.
 * @param {number} y - coordinate for the menu portion of the chat.
 * @param {number} width - size for the menu portion of the chat.
 * @param {number} height - size for the menu portion of the chat.
 */
var ChatBox = function(canvas,x,y,width,height,max) {
    Announcer.call(this,x,y,width,height,max || 5);
    var chat = this;
    this.messages = [];
    this.fillStyle = "rgba(50,100,200,0.5)";
    this.textColor = "rgb(255,255,255)";
    this.hiddenTextColor = "rgba(0,0,0,1.0)";
    this.fontSize = 20;
    this.textAlign = "left";
    this.textBaseline = "top";
    var chat = this;
    this._createTextbox(canvas,function(e) {
        if (e.keyCode === Keys.ENTER) {
            if (e.target.value)
                socket.emit('chat',e.target.value);
            chat.hide();
            e.cancel = true;
        }
    });
    this.resize(canvas);
    this.hide();
}

ChatBox.prototype = Object.create(Announcer.prototype);
ChatBox.prototype.constructor = ChatBox;
ChatBox._super = Object.getPrototypeOf(ChatBox.prototype);

ChatBox.MAX_LINES = 20;
ChatBox.OFFSET = 5;

ChatBox.prototype.update = function() {
    this.setVisibility();
}

ChatBox.prototype.setVisibility = function() {
    if (document.activeElement === this.textbox && this.hidden) {
        this.show();
    }
    else if (document.activeElement !== this.textbox && !this.hidden) this.hide();
}

/**
 * @summary Hides the chat
 */
ChatBox.prototype.hide = function() {
    this.hidden = true;
    this.shouldDraw = false;
    this.textbox.value = "";
    this.textbox.blur();
}

/**
 * @summary Shows the chat
 */
ChatBox.prototype.show = function() {
    this.hidden = false;
    this.shouldDraw = true;
    this.textbox.focus();
}

/**
 * @summary Draws the chat
 *
 * @param {Object} canvas - HTML5 Canvas's context2D.
 */
ChatBox.prototype.draw = function(canvas) {
    if (this.shouldDraw) {
        Announcer._super.draw.call(this,canvas);
        this.drawMessages(canvas);
    }
    else this.drawAnnouncements(canvas);
}

/**
 * @summary Draws the chat
 *
 * @param {Object} canvas - HTML5 Canvas's context2D.
 */
ChatBox.prototype.drawStrings = function(canvas,strings) {
    var x = this.x;
    var y = this.topSide() + this.fontSize * (ChatBox.MAX_LINES - strings.length);
    for (var i = 0; i < strings.length; i++) {
        if (strings[i].draw) {
            strings[i].draw(canvas,x,y);
        }
        else this.drawText(canvas,strings[i],x,y);
        y += this.fontSize;
    }
}

/**
 * @summary Draws the chat
 *
 * @param {Object} canvas - HTML5 Canvas's context2D.
 */
ChatBox.prototype.drawMessages = function(canvas) {
    this.drawStrings(canvas,this.messages);
}

/**
 * @summary Draws the chat
 *
 * @param {Object} canvas - HTML5 Canvas's context2D.
 */
ChatBox.prototype.drawAnnouncements = function(canvas) {
    this.drawStrings(canvas,this.announcements);
}

// /**
//  * @summary Resizes the chat and associated components
//  *
//  * @param {Object} canvas - HTML5 Canvas.
//  */
ChatBox.prototype.resize = function(canvas) {
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var screenW = canvasW / 3;
    var screenH = this.fontSize * (ChatBox.MAX_LINES + 1) + ChatBox.OFFSET;
    var screenX = 0;
    var screenY = canvasH - screenH;
    this.set(screenX,screenY,screenW,screenH);
    this.setTextbox(canvas);
}

ChatBox.prototype.receiveMessage = function(message) {
    this.addAnnouncement(message,null,this.hiddenTextColor);
    this.messages.push(message);
    if (this.messages.length > ChatBox.MAX_LINES) {
        this.messages.shift();
    }
}

/**
 * @summary Create Textbox for this chat
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {function} eventlistener - textbox eventlistener function.
 * @param {number} x - coordinate for the menu portion of the chat.
 * @param {number} y - coordinate for the menu portion of the chat.
 * @param {number} width - size for the textbox.
 * @param {number} height - size for the textbox.
 * @param {number} zIndex - zIndex for the textbox.
 * @return {Object} textbox - HTML textbox created for this screen.
 */
ChatBox.prototype._createTextbox = function(canvas,funct,x,y,w,h,zIndex) {
    this.textbox = document.createElement('input');
    this.textbox.placeholder = "Enter text here to chat";
    this.textbox.style.position = "absolute";
    this.textbox.style.backgroundColor = "rgba(100,0,255,0.7)";
    this.textbox.style.borderStyle = "none";
    this.setTextbox(canvas,x,y,w,h,zIndex);
    this.textbox.addEventListener('keyup', funct);
    document.getElementById("overlay").appendChild(this.textbox);
    return this.textbox;
}

/**
 * @summary Moves textbox, does not effectively support the parameters due to resizing issues
 *
 * @param {Object} canvas - HTML5 Canvas.
 * @param {number} x - coordinate for the menu portion of the chat.
 * @param {number} y - coordinate for the menu portion of the chat.
 * @param {number} width - size for the textbox.
 * @param {number} height - size for the textbox.
 * @param {number} zIndex - zIndex for the textbox.
 * @return {Object} textbox - HTML textbox created for this screen.
 */
ChatBox.prototype.setTextbox = function(canvas,x,y,w,h,zIndex) {
    this.textbox.style.zIndex = zIndex || 2;
    w = w || Math.floor(this.width);
    h = h || Math.floor(this.fontSize);
    var size = toClientPos(canvas,{x:w,y:h},true);
    var bounds = toClientPos(canvas,{x:this.x,y:this.bottomSide()});
    w = size.x;
    h = size.y;
    this.textbox.style.width  = w + "px";
    this.textbox.style.height = h + "px";
    this.textbox.style.fontSize = h + "px";
    x = x || (bounds.x);
    y = y || (bounds.y);
    this.textbox.style.left = x + "px";
    this.textbox.style.bottom = window.innerHeight - canvas.getBoundingClientRect().height + "px";
    return this.textbox;
}