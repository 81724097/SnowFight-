var POINTS_CHANGED = false;

var Leaderboard = function(x,y,width,height,max) {
	UIRectangle.call(this,x,y,width,height);
	this.text = "Leaderboard";
	this.fillStyle = "rgba(50,100,200,0.5)";
	this.textColor = "rgb(255,255,255)";
	this._pointHolders = [];
	this._leaders = new Array(max || 10);
	var h = (height - this.fontSize)/this._leaders.length;
	for (var i = 0; i < this._leaders.length; i++) {
		this._leaders[i] = new Leader(x,y + this.fontSize + i*h,width,h,i+1);
	}
}

Leaderboard.prototype = Object.create(UIRectangle.prototype);
Leaderboard.prototype.constructor = Leaderboard;

Leaderboard.prototype.getPlaceOf = function(holder) {
	return this._pointHolders.indexOf(holder);
}

Leaderboard.compare = function(a,b) { return b.points - a.points; };

Leaderboard.prototype.addPointHolder = function(holder) {
	this._pointHolders.push(holder);
	this.updateLeaders();
}

Leaderboard.prototype.removePointHolder = function(holder) {
	var index = this._pointHolders.indexOf(holder);
	if ( index !== -1 )
		this._pointHolders.remove(index);
	this.updateLeaders();
}

Leaderboard.prototype.update = function() {
	if (POINTS_CHANGED)
		this.updateLeaders();
}

Leaderboard.prototype.updateLeaders = function() {
	this._pointHolders.sort(Leaderboard.compare);
	for (var i = 0; i < this._leaders.length; i++) {
		this._leaders[i].setPlayer(i < this._pointHolders.length ? this._pointHolders[i] : {});
	}
}

Leaderboard.prototype.draw = function(canvas) {
	Object.getPrototypeOf(Leaderboard.prototype).draw.call(this,canvas);
	this.drawText(canvas,this.text,this.centerX(),this.topSide());
	for (var i = 0; i < this._leaders.length; i++) {
		this._leaders[i].draw(canvas);
	}
}

// element in the leaderboard
var Leader = function(x,y,width,height,index) {
	UIRectangle.call(this,x,y,width,height);
	this.fillStyle = "rgba(0,0,0,0)";
	this.textColor = "rgb(255,255,255)";
	this.offset = 5; // offset from the right and left side of the board
	this.index = index;
}

Leader.prototype = Object.create(UIRectangle.prototype);
Leader.prototype.constructor = Leader;

Leader.prototype.setPlayer = function(player) {
	this.name = typeof player.text === "string" ? (this.index + ". " + player.text) : "";
	this.points = player.points;
}

Leader.prototype.draw = function(canvas) {
	Object.getPrototypeOf(Leader.prototype).draw.call(this,canvas);
	this.drawName(canvas);
	this.drawPoints(canvas);
}

Leader.prototype.drawName = function(canvas) {
	if (this.name)
	{
		this.textAlign = "left";
		this.drawText(canvas,this.name,this.leftSide() + this.offset, this.topSide());
	}
}

Leader.prototype.drawPoints = function(canvas) {
	if (this.points || this.points == 0)
	{
		this.textAlign = "right";
		this.drawText(canvas,this.points + "",this.rightSide() - this.offset, this.topSide());
	}
}