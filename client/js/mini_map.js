var MINI_MAP_STYLES = [{ type: "PLAYER",    style: "rgb(255,50,50)" }, 
			  { type: "PROJECTILE",style: "rgba(0,0,0,0)"  }, 
			  { type: "SNOW_PILE", style: "rgb(50,255,50)" }, 
			  { type: "SNOW_WALL", style: "rgb(50,50,255)" }, 
			  { type: "SNOW_MAN",  style: "rgb(50,255,255)"}];

var MiniMap = function(canvas,x,y,width,height) {
	UIRectangle.call(this,x,y,width,height);
	this.fillStyle = "rgba(150,150,150,0.5)";
	this.resize(canvas);
}

MiniMap.prototype = Object.create(UIRectangle.prototype);
MiniMap.prototype.constructor = MiniMap;
var _super = Object.getPrototypeOf(MiniMap.prototype);

MiniMap.OFFSET = 10;

MiniMap.prototype.setMap = function(map) {
	this.map = map;
	this.scaleX = this.width / map.width;
	this.scaleY = this.height / map.height;
}

MiniMap.prototype.draw = function(canvas) {
	_super.draw.call(this,canvas);
	Rectangle.fill(canvas,this,this.fillStyle);
	var sprites = engine.gameObjects;
	canvas.save();
	canvas.translate(this.x,this.y);
	canvas.scale(this.scaleX,this.scaleY);
	for (var type = 0; type < sprites.length; type++) {
		for (var i = 0; i < sprites[type].length; i++) {
			var s = sprites[type][i];
			if (s && s.type !== "FAKE") {
				Rectangle.fill(canvas,sprites[type][i],this.getFillStyle(sprites[type][i]));
			}
		}
	}
	canvas.restore();
}

/**
 * @summary Resizes the start screen and associated components
 *
 * @param {Object} canvas - HTML5 Canvas.
 */
MiniMap.prototype.resize = function(canvas) {
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var miniMapW = canvasW / 6 - MiniMap.OFFSET*2;
    var miniMapH = miniMapW;
    var miniMapX = canvasW - miniMapW - MiniMap.OFFSET;
    var miniMapY = canvasH - miniMapH - MiniMap.OFFSET;
	this.set(miniMapX,miniMapY,miniMapW,miniMapH);
}

MiniMap.prototype.getFillStyle = function(sprite) {
	if (sprite) {
		for (var i = 0; i < MINI_MAP_STYLES.length; i++) {
			if (sprite.type === MINI_MAP_STYLES[i].type )
				return MINI_MAP_STYLES[i].style;
		}
		console.error("Failed to retrieve style for:",sprite);
	}
	console.log("Failed to retrieve style from " + sprite);
}