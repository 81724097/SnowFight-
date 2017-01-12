var GameSprite = require('./game_sprite.js');
var Constants = require('../constants.js');

/**
 * @summary Sprite that can regen and slows down when crouched
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
var Character = function(x,y,radius,velocity,dir,time,maxHp,atk) {
	GameSprite.call(this,x,y,radius,velocity,dir,time,maxHp,atk);
    this.type = "PLAYER";
    this.maxSnow = Constants.DEFAULT_MAX_SNOW;
    var s = this;
    this.timedFunction = function() { s.regen(); };
}

Character.prototype = Object.create(GameSprite.prototype);
Character.prototype.constructor = Character;
var _super = Object.getPrototypeOf(Character.prototype);

/**
 * @summary Regens this sprite's hp
 *
 * Called every Constants.DEFAULT_REGEN_DELAY milliseconds by 1 hp.
 * Uses the main timer and calls this.startTimers()
 */
Character.prototype.regen = function() {
    if (this.hp < this.maxHp)
        this.hp++;
    this.startTimers();
}

/**
 * @summary Returns this sprite's velocity
 *
 * Returns this sprite's velocity, halves the velocity if this sprite is crouching
 *
 * @see CrouchingSprite.prototype.isCrouching()
 * @return this.velocity / (this.isCrouching() ? 2 : 1).
 */
Character.prototype.getVelocity = function() {
    return this.velocity / (this.isCrouching() ? 2 : 1);
}

/**
 * @summary Copy given sprite's info.
 * @see {@link ./cloneable_sprite.js CloneableSprite}
 * @param object sprite to copy.
 * @return this.
 */
Character.prototype.createCopy = function(SubClass) {
    var copy = _super.createCopy.call(this,SubClass);
    copy.projectile = this.projectile;
    copy.wall = this.wall;
    return copy;
}

module.exports = Character;