
var Entities = require('./entities.js');
var Constants = require('../constants.js');

/**
 * @summary SnowPile
 *
 *
 * @class
 * @augments Entities,GameSprite,TimedSprite,CrouchingSprite,CloneableSprite,CollidableSprite,Sprite,InputSprite,Circle
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
var SnowPile = function(x,y,radius,dir,time) {
	Entities.call(this,x,y,radius,dir,time);
	this.setStats(Constants.DEFAULT_PILE_SIZE); // maxHp or maximum growth the snowWalls can have
	this.type = "SNOW_PILE";
	this.collidable = false;
	this.snow = Constants.DEFAULT_PILE_SNOW;
	var s = this;
	this.timedFunction = function() { s.shrink(); };
}

SnowPile.prototype = Object.create(Entities.prototype);
SnowPile.prototype.constructor = SnowPile;
var _super = Object.getPrototypeOf(SnowPile.prototype);

/**
 * @summary Returns true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision) 
 *
 * note: calculations may be duplicated in this method when both this.collide(sprite) and sprite.collide(this) does the same calculations
 *
 * @param {Object} sprite
 * @return true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision)
 */
SnowPile.prototype.extraSpriteCollisions = function(sprite) {
	if (this.overlaps(sprite)) {
		sprite.snowPile = this;
		sprite.hitSprite(this);
	}
	return false;
}

/**
 * @summary Shrinks this sprite by decreasing hp
 *
 * Decrease sprite hp every Constants.DEFAULT_PILE_DELAY milliseconds
 * if hp <= 0, calls this.disappear()
 * Uses the main timer
 */
SnowPile.prototype.shrink = function() {
	_super.shrink.call(this);
	if (!this.isDead)
		this.startTimers();
}

module.exports = SnowPile;