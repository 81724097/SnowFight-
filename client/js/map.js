
var offset = 5;
// width and height are the number of tiles for the map
var Map = function(map) {
	Rectangle.call(this,map.x-offset,map.y-offset,map.width+offset*2,map.height+offset*2);
	this.generate(map);
    this.fillStyle = "white"; // "rgb(50, 50, 50)";
	this.strokeStyle = "rgb(255,0,0)";
	this.strokeWidth = offset * 2; 
}

Map.prototype = Object.create(Rectangle.prototype);
Map.prototype.constructor = Map;
Map._super = Object.getPrototypeOf(Map.prototype);

Map.prototype.generate = function(map) {
	this.tiles = new Array(map.tiles.length);
	var x,y;
	for (var i = 0; i < this.tiles.length; i++) {
		this.tiles[i] = new Array(map.tiles[i].length);
		for (var j = 0; j < this.tiles[i].length; j++) {
			x = map.x + i*Tile.SIZE + Tile.SIZE/2;
			y = map.y + j*Tile.SIZE + Tile.SIZE/2;
			this.tiles[i][j] = new Tile(x,y,Tile.SIZE/2);
		}
	}
}

Map.prototype.draw = function(canvas) {
	Map._super.draw.call(this, canvas);
	for (var i = 0; i < this.tiles.length; i++) {
		for (var j = 0; j < this.tiles[i].length; j++) {
			this.tiles[i][j].draw(canvas);
		}
	}
}

// ------------------------ MAP TILE ---------------------------------- //
var Tile = function(x,y,size) {
	Sprite.call(this,x,y,size);
    this.fillColor = "rgb(50, 50, 100)";
    if (MAP_IMAGES) this.image = MAP_IMAGES;
}

Tile.SIZE = 64;

Tile.prototype = Object.create(Sprite.prototype);
Tile.prototype.constructor = Tile;