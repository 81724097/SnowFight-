
var Entities = require('./entities.js');
var Constants = require('../constants.js');

/**
 * @summary SnowWall
 *
 *
 * @class
 * @augments Entities,GameSprite,TimedSprite,CrouchingSprite,CloneableSprite,CollidableSprite,Sprite,Button,Circle
 * @mixes Rectangle
 *
 * @param int x coordinate
 * @param int y coordinate
 * @param int radius size
 * @param int dir (-1 means stop)
 * @param int time 
 * @param int maxHp
 * @param int atk
 */
var SnowWall = function(x,y,radius,dir,time,maxHp,atk) {
	Entities.call(this,x,y,radius,dir,time,maxHp,atk);
	this.setStats(Constants.DEFAULT_WALL_SIZE); // maxHp or maximum growth the snowWalls can have
	this.hp = Constants.DEFAULT_WALL_STARTING_HP;
	this.type = "SNOW_WALL";
	this.checkSize();
	var s = this;
	this.timedFunction = function() { s.shrink(); };
}

SnowWall.prototype = Object.create(Entities.prototype);
SnowWall.prototype.constructor = SnowWall;
var _super = Object.getPrototypeOf(SnowWall.prototype);

/**
 * @summary Sets the size of this snow wall based on amount of hp
 *
 * Snow wall is small when hp <= maxHp/2 and large when hp > maxHp/2
 */
SnowWall.prototype.checkSize = function() {
	if (this.hp <= this.maxHp/2)
		this.crouch();
	else
		this.stand();
}

/**
 * @summary Called when this sprite and another snow wall collide with each other.
 *
 * @param {Object} sprite.
 */
SnowWall.prototype.hitSnowWall = function(sprite) {
	sprite.hp = Math.min(this.hp + sprite.hp,sprite.maxHp);
	sprite.checkSize();
	sprite.startTimers();
	this.disappear();
}

/**
 * @summary Called when this sprite and another snow man collide with each other.
 *
 * @param {Object} sprite.
 */
SnowWall.prototype.hitSnowMan = function(sprite) {
    sprite.hp = Math.min(this.hp + sprite.hp,sprite.maxHp);
    sprite.startTimers();
    this.disappear();
}

/**
 * @summary Returns true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision) 
 *
 * note: calculations may be duplicated in this method when both this.collide(sprite) and sprite.collide(this) does the same calculations
 *
 * @param {Object} sprite
 * @return true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision)
 */
SnowWall.prototype.extraSpriteCollisions = function(sprite) { // the collision only occurs if the sprite is not from this projectile's origin player
	if (sprite.type === "PROJECTILE") { // let projectiles do the colliding (note: voids the hitProjectile method so must be called here)
		this.hitProjectile(sprite);
		return false;
	}
	return true;
}

/**
 * @summary Shrinks this sprite by decreasing hp
 *
 * Decrease sprite hp every Constants.DEFAULT_WALL_DELAY milliseconds
 * if hp <= 0, calls this.disappear()
 * Note: uses the main timer
 * Then calls this.checkSize()
 */
SnowWall.prototype.shrink = function() {
	_super.shrink.call(this);
	if (!this.isDead)
		this.startTimers();
	this.checkSize();
}

module.exports = SnowWall;