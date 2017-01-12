var InputSprite = require('./input_sprite.js');
var Constants = require('../constants.js');

function roundDir(dir) {
	return Math.round(dir/90) % 4 * 90;
}

/**
 * @summary Basic sprite that can move
 *
 * Basic Sprite that can move, extends the Button for mouse and keyboard implementations
 * Can be contained within a rectangle (to represent a world) by setting Sprite.bounds = new Rectangle()
 *
 * @class
 * @augments Button,Circle
 * @mixes Rectangle
 *
 * @param int x coordinate
 * @param int y coordinate
 * @param int radius size
 * @param int velocity
 * @param int dir (-1 means stop)
 */
var Sprite = function(x, y, radius, velocity, dir) {
	InputSprite.call(this, x, y, radius);
	this.type = "SPRITE"; // in game types will be: PLAYER, PROJECTILE, SNOW_WALL, SNOW_MAN, SNOW_PILE
	this.velocity = velocity;
	this.dir = dir || Constants.DEFAULT_DIRECTION; // 0 = EAST, 90 = SOUTH, 180 = WEST, 270 = NORTH, -1 = stop
	this.dirFacing = Constants.DEFAULT_DIRFACING;
    this.isDead = false;
}

Sprite.prototype = Object.create(InputSprite.prototype);
Sprite.prototype.constructor = Sprite;
var _super = Object.getPrototypeOf(Sprite.prototype);
	
/**
 * @summary Returns this.velocity
 *
 * Intended for overriding in case velocity needs to change under certain conditions
 * Used by this.update()
 *
 * @return this.velocity
 */
Sprite.prototype.getVelocity = function() {
	return this.velocity;
}
	
/**
 * @summary Updates and moves this sprite
 *
 * Checks the conditions for mouse and keyboard input and moves according to the velocity and direction.
 * Calls this.updateDirFacing()
 */
Sprite.prototype.update = function() {
	_super.update.call(this);
	this.move(this.getVelocity());
	this.updateDirFacing();
}
	
/**
 * @summary Updates this.dirFacing
 *
 * Calls roundDir(this.dir)
 */
Sprite.prototype.updateDirFacing = function() {
	this.dirFacing = this.dir !== -1 ? roundDir(this.dir) : this.dirFacing;
}
	
/**
 * @summary translates this sprite.
 *
 * moves this sprite based on the given change in x and y.
 *
 * @param int x change in x.
 * @param int y change in y.
 */
Sprite.prototype.translatePosition = function(x,y) {
	this.x += x;
	this.y += y;
}
	
/**
 * @summary translates this sprite.
 *
 * moves this sprite based on the given velocity and direction.
 *
 * @param int velocity.
 * @param int direction.
 */
Sprite.prototype.translateDirection = function(velocity,direction) {
	this.translatePosition(velocity * Math.cos( Constants.toRadians(direction) ), 
						   velocity * Math.sin( Constants.toRadians(direction) ));
}
	
/**
 * @summary moves this sprite
 *
 * Moves this sprite according to the given velocity and this.dir unless this.dir < 0
 *
 * @param int velocity.
 */
Sprite.prototype.move = function(velocity) {
	if ( this.dir >= 0 )
	{
		this.translateDirection(velocity || this.getVelocity(),this.dir);
	}
}

/**
 * @summary Sets this sprite to be dead
 *
 * Sets this.isDead to true. The engine should remove this sprite next update cycle
 */
Sprite.prototype.die = function() {
    this.isDead = true;
}

/**
 * @summary Returns an object that contains this sprite's info (variables).
 *
 * @return an object that contains this sprite's info (variables).
 */
Sprite.prototype.getInfo = function() {
	return {
		type: this.type,
		text: this.text,
		index: this.index,
		x: this.x,
		y: this.y,
		radius: this.radius,
		velocity: this.velocity,
		dir: this.dir,
		dirFacing: this.dirFacing,
    	isDead: this.isDead
	};
}

module.exports = Sprite;