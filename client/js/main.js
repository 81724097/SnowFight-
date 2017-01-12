
var SNOW_PILES = 0;
var PLAYERS = 1;
var SPRITES = 2;
var SNOW_MEN = 3;
var SNOW_WALLS = 4;
var PROJECTILES = 5;
var NUM_TYPES = 6;

window.onload = function() {
    var canvas = document.getElementById("game");
    // disable context menu (right click's default) only for the canvas
    disableRightMouseMenu(canvas);
    // disable middle click's scroll only for canvas
    disableMiddleMouseScroll(canvas);

    engine = new GameEngine(canvas, 30);
    engine.setUIObjects(canvas);

    socket.on('loadWorld', function (data) {
        console.log("Received and loading world and sprites...");
        engine.setupInput(socket);
        engine.setWorld(data.world);
        engine.setGameObjects(data.gameObjects);
        engine.run();
    });
    socket.on('player', function (data) {
        console.log("Received ID " + data.index + " and player location (" + data.x + "," + data.y + ")");
        engine.add(PLAYERS,data.index,data);
        var player = engine.gameObjects[PLAYERS][data.index];
        player.type = "PLAYER";
        player.index = data.index;
        engine.player = player;
        engine.startScreen.hide();
    });
    socket.on('update', function (data) {
        engine.updateGameObjects(data);
    });
    socket.on('announce', function (data) {
        console.log(data);
        engine.announcer.addAnnouncement(data);
    });
    socket.on('chat', function (data) {
        engine.chat.receiveMessage(data);
    });

    var loadingImage = document.getElementById("load");
    loadingImage.parentNode.removeChild(loadingImage);
    engine.resize_canvas();
    engine.startScreen.show();
    socket.emit('requestWorld');
}
// --------------------- HELPER METHODS --------------------- //

function newTextSprite(x,y,text,textAlign,textBaseline,textColor) {
    var s = new Sprite(x,y);
    if (typeof text === "function") {
        s.update = function() {
            s.text = text();
        }
    }
    else {
        s.text = text;
    }
    s.textAlign = textAlign || "left";
    s.textBaseline = textBaseline || "top";
    s.textColor = textColor || s.textColor;
    return s;
}

/**
 * converts degree to radians
 * @param degree
 * @returns {number}
 */
function toRadians(degree) {
    return degree * (Math.PI / 180);
}

/**
 * Converts radian to degree
 * @param radians
 * @returns {number}
 */
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function getMousePos(canvas, e) { // returns mouse position based on the canvas rather than the window
    return toCanvasPos(canvas, { x: e.clientX, y: e.clientY } );
}
function toCanvasPos(canvas,pos) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (pos.x - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (pos.y - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

function toClientPos(canvas,pos,shouldNotAdd) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = rect.width / canvas.width,    // relationship bitmap vs. element for X
    scaleY = rect.height / canvas.height;  // relationship bitmap vs. element for Y

    return {
        x: pos.x * scaleX + (shouldNotAdd?0:rect.left), // scale mouse coordinates after they have
        y: pos.y * scaleY + (shouldNotAdd?0:rect.top)  // been adjusted to be relative to element
    }
}

// disable context menu (right click's default) only for the given html element
function disableRightMouseMenu(element)
{
    if (element.addEventListener) {
        element.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);
    } else {
        element.attachEvent('oncontextmenu', function() { // apparently IE uses this way (majority of other browsers use the other way)
            window.event.returnValue = false;
        });
    }
}

// disable middle click's scroll only for html element
function disableMiddleMouseScroll(element)
{
    element.onmousedown = function(e) { 
        if (e.button === 1) 
            return false;
    }
}

function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function setElementPosition(canvas,element,pos,size) {
    var bounds = toClientPos(canvas,pos);
    if (size) {
        bounds.x -= size.x/2;
        bounds.y -= size.y/2;
    }
    element.style.left = bounds.x + "px";
    element.style.top = bounds.y + "px";
    return bounds;
}

function setElementSize(canvas,element,size,changeFont) {
    size = toClientPos(canvas,size,true);
    element.style.width  = size.x + "px";
    element.style.height = size.y + "px";
    if (changeFont)
        element.style.fontSize = size.y + "px";
    return size;
}

// attempt to make splice(index,1) more efficient
Array.prototype.remove = function(index) {
    var len = this.length;
    if (!len) { return }
    while (index<len) { 
        this[index] = this[index+1]; index++;
    }
    this.length--;
}