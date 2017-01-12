
var Rectangle = require('./rectangle.js');
// width and height are the number of tiles for the map
var Map = function(x,y,width,height) {
	Rectangle.call(this,x,y);
	this.generate(width,height);
}

Map.prototype = Object.create(Rectangle.prototype);
Map.prototype.constructor = Map;

Map.prototype.generate = function(width,height) {
	this.width = width*Tile.SIZE; // set this.width and this.height to the pixel width and height of the map
	this.height = height*Tile.SIZE;
	this.tiles = new Array(width);
	for (var i = 0; i < this.tiles.length; i++) {
		this.tiles[i] = new Array(height);
		for (var j = 0; j < this.tiles[i].length; j++) {
			this.tiles[i][j] = new Tile(i*Tile.SIZE + Tile.SIZE/2,j*Tile.SIZE + Tile.SIZE/2);
		}
	}
}

Map.prototype.update = function() {
	for (var i = 0; i < this.tiles.length; i++) {
		for (var j = 0; j < this.tiles[i].length; j++) {
			this.tiles[i][j].update();
		}
	}
}

// ----------------- TILE --------------- //
var Tile = function(x,y,size) {
	if (!size) size = Tile.SIZE;
	Rectangle.call(this,x,y,size,size);
}

Tile.SIZE = 64;

Tile.prototype = Object.create(Rectangle.prototype);
Tile.prototype.constructor = Tile;

module.exports = Map;