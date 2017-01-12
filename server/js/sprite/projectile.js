
var GameSprite = require('./game_sprite.js');

/**
 * @summary Projectile
 *
 *
 * @class
 * @augments GameSprite,TimedSprite,CrouchingSprite,CloneableSprite,CollidableSprite,Sprite,InputSprite,Circle
 * @mixes Rectangle
 *
 * @param int x coordinate
 * @param int y coordinate
 * @param int radius size
 * @param int velocity
 * @param int dir (-1 means stop)
 * @param int time 
 * @param int maxHp
 * @param int atk
 */
var Projectile = function(sprite,x,y,radius,velocity,dir,time) {
	GameSprite.call(this,x,y,radius,velocity,dir,time,1);
	this.mySprite = sprite;
	this.type = "PROJECTILE";
	this.crouch();
	var s = this;
	this.timedFunction = function() { s.disappear(); };
}

Projectile.prototype = Object.create(GameSprite.prototype);
Projectile.prototype.constructor = Projectile;
var _super = Object.getPrototypeOf(Projectile.prototype);

/**
 * @summary Determines what happens when this collides with other sprites.
 *
 * called when this sprite and another sprite collides with each other
 * (at the moment, this method is called twice i.e. this.hitSprite(sprite) and sprite.hitSprite(this))
 *
 * @see CollidingSprite.prototype.hitSprite();
 * @param object sprite that collided with this sprite.
 */
Projectile.prototype.hitSprite = function(sprite) {
	if (sprite === this.mySprite || sprite.type === "SNOW_PILE") return; // don't collide with snow piles or sprite that created this
	if (sprite.takeDamage(this) && sprite.type === "PLAYER") {
			sprite.killer = this.mySprite.text;
			this.mySprite.points++; // add points to just the players while dealing damage to everything according to the takeDamage() method
		}
	this.disappear();
}

/**
 * @summary Determines what happens when this collides with boundary.
 *
 * Called when this sprite collides with the boundary
 * @see CollidingSprite.prototype.hitBoundary()
 * @param object collision where collision.x and collision.y are the components of the direction to move this sprite back onto field
 */
Projectile.prototype.hitBoundary = function(collision) { // disappear when hitting the border
	this.disappear();
}

/**
 * @summary Returns true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision) 
 *
 * note: calculations may be duplicated in this method when both this.collide(sprite) and sprite.collide(this) does the same calculations
 *
 * @param object sprite
 * @return true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision)
 */
Projectile.prototype.otherSpriteCollisions = function(sprite) { // to be overridden so that subclasses can fully control this collision
	return this.extraSpriteCollisions(sprite);
}

/**
 * @summary Returns true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision) 
 *
 * note: calculations may be duplicated in this method when both this.collide(sprite) and sprite.collide(this) does the same calculations
 *
 * @param object sprite
 * @return true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision)
 */
Projectile.prototype.extraSpriteCollisions = function(sprite) { // the collision only occurs if the sprite is not from this projectile's origin player
	return sprite !== this.mySprite && sprite.mySprite !== this.mySprite && this.compareZIndex(sprite);
}

/**
 * @summary Returns whether or not this sprite can collide with the other based solely on the zIndex
 *
 * If the other sprite is a snow wall, calls this.rise()
 * returns this.zIndex <= sprite.zIndex
 *
 * @param {Object} sprite.
 * @return this.zIndex <= sprite.zIndex. (true if this is below or equal in height to the other sprite)
 */
Projectile.prototype.compareZIndex = function(sprite) {
	if (sprite.type === "SNOW_WALL")
		this.rise();
	return this.zIndex <= sprite.zIndex;
}

/**
 * @summary Rises this sprite by changing the zIndex.
 *
 * Calls this.stand() then sets a timer for how long the projectile rises before falling back.
 */
Projectile.prototype.rise = function() {
	this.stand();
	var proj = this;
	this._riseTimer = this.setTimer(this._riseTimer,function() { proj.crouch(); },this.time/3);
}

module.exports = Projectile;