/**
  * Basic Sprite that can move, extends the Button for mouse and keyboard implementations
  * Can be contained within a rectangle by: Sprite.bounds = new Rectangle()
  * Can collide with
  */
var Sprite = function(x, y, radius, velocity, dir) {
	Button.call(this, x, y, radius);
	this.type = "SPRITE";
	this.velocity = velocity || 1;
	this.dir = dir || -1; // 0 = EAST, 90 = SOUTH, 180 = WEST, 270 = NORTH, -1 = stop
	this.hoverColor = this.fillColor;
	this.textBaseline = "bottom";
	this.points = 0;
	this.snow = 0;
	this.crouching = false;
	this.setStats();
}

Sprite.prototype = Object.create(Button.prototype);
Sprite.prototype.constructor = Sprite;
Sprite._super = Object.getPrototypeOf(Sprite.prototype);

Sprite.prototype.draw = function(canvas) {
	if (this.imageIndex >= 0) {
		if (this.type === "PROJECTILE") {
			this.image = this.images[Math.floor(this.imageIndex)];
			this.imageIndex += 0.5;
			this.imageIndex %= this.images.length;
		}
		else if (this.type === "SNOW_WALL") {
			this.image = this.images[Math.floor(this.imageIndex)];
			this.imageIndex = this.zIndex;
		}
		else if (this.type === "PLAYER") {
			var action = 0; // walk
			if (this.zIndex === 0) {
				action = 1; // crouch
			}

			if(action == 0)
			{
				this.imageIndex += 1/30.0;
				if(this.crouching == true)
				{
					if(this.imageIndex > 1)
					{
						this.crouching = false;
					}
					this.image = this.images[this.dirFacing/90][1][Math.min(Math.floor(this.imageIndex*this.images[this.dirFacing/90][action].length),this.images[this.dirFacing/90][action].length-1)];
					this.imageIndex %= 1;
				}
				else
				{
					this.imageIndex %= 1;
					this.image = this.images[this.dirFacing/90][action][Math.min(Math.floor(this.imageIndex*this.images[this.dirFacing/90][action].length),this.images[this.dirFacing/90][action].length-1)];
				}
			}
			else
			{
				if(this.crouching == false)
				{
					this.imageIndex = 0;
					this.crouching = true;
				}
				this.imageIndex += 1/30.0;
				this.imageIndex = Math.min(0.5,this.imageIndex);
				this.image = this.images[this.dirFacing/90][action][Math.min(Math.floor(this.imageIndex*this.images[this.dirFacing/90][action].length),this.images[this.dirFacing/90][action].length-1)];
			}
		}
	}
	this._textX = this.x;
	this._textY = this.topSide();
	Sprite._super.draw.call(this,canvas);
	this.drawHp(canvas);
}

Sprite.prototype.drawHp = function(canvas) {
	if (!this.damagable || this.hp === this.maxHp || this.hp <= 0) return;
	var x = this.leftSide();
	var y = this.bottomSide();
	var w = this.radius * 2;
	var h = 7;
	var offset = 1;
	canvas.fillStyle = "rgb(100,100,100)";
	canvas.fillRect(x-offset,y-offset,w+offset*2,h+offset*2);
	canvas.fillStyle = "rgb(0,200,0)";
	canvas.fillRect(x,y,Math.floor(this.hp*w/this.maxHp),h);
}

Sprite.prototype.setStats = function(maxHp,atk) {
	this.maxHp = maxHp || 10;
	this.hp = this.maxHp;
	this.atk = atk || 2;
}

Sprite.prototype.getStats = function(maxHp,atk) {
	return {maxHp: this.maxHp, 
			hp: this.hp, 
			atk: this.atk};
}

Sprite.prototype.copySpriteInfo = function(info) {
	this.type = info.type;
	this.text = info.text;
    this.x = info.x || this.x;
    this.y = info.y || this.y;
    this.radius = info.radius || this.radius;
	this.velocity = info.velocity || this.velocity;
	this.dir = info.dir || this.dir; // 0 = EAST, 90 = SOUTH, 180 = WEST, 270 = NORTH, -1 = stop
	this.dirFacing = info.dirFacing;
	this.collidable = info.collidable;
	this.damagable = info.damagable;

	this.points = info.points;
	POINTS_CHANGED = this._points !== this.points;
	this._points = this.points;

	this.snow = info.snow;
	this.maxSnow = info.maxSnow;
	this.index = info.index;
	this.zIndex = info.zIndex;
	this.isDead = info.isDead;
	this.killer = info.killer;
	this.copySpriteStats(info);
}

Sprite.prototype.copySpriteStats = function(stats) {
	this.setStats(stats.maxHp,stats.atk);
	this.hp = stats.hp || this.hp;
}

Sprite.copy = function(s) {
	var sprite = new Sprite(s.x,s.y,s.radius,s.velocity,s.dir);
	sprite.copySpriteInfo(s);
    return sprite;
}
