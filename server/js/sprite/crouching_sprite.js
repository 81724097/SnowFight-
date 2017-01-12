var StatsSprite = require('./stats_sprite.js');
 
/**
 * @summary Sprite that can crouch
 *
 * Basic sprite that can crouch using the int zIndex
 *
 * @class
 * @augments CloneableSprite,CollidableSprite,Sprite,InputSprite,Circle
 * @mixes Rectangle
 *
 * @param int x coordinate
 * @param int y coordinate
 * @param int radius size
 * @param int velocity
 * @param int dir (-1 means stop)
 * @param int maxHp
 * @param int atk
 */
var CrouchingSprite = function(x,y,radius,velocity,dir, maxHp, atk) {
    StatsSprite.call(this,x,y,radius,velocity,dir,maxHp,atk);
    this.stand();
}

CrouchingSprite.prototype = Object.create(StatsSprite.prototype);
CrouchingSprite.prototype.constructor = CrouchingSprite;
var _super = Object.getPrototypeOf(CrouchingSprite.prototype);

var CROUCH = 0;
var STANDING = 1;

/**
 * @summary Sets this.zIndex to the crouching variable (0).
 *
 * Sets this.zIndex to 0.
 */
CrouchingSprite.prototype.crouch = function() {
    this.zIndex = CROUCH;
}

/**
 * @summary Sets this.zIndex to the standing variable (1).
 *
 * Sets this.zIndex to 1.
 */
CrouchingSprite.prototype.stand = function() {
    this.zIndex = STANDING;
}

/**
 * @summary Returns whether or not this sprite is crouching
 *
 * Returns whether or not this.zIndex is set to the crouching variable.
 *
 * @return true if this sprite is crouching else false.
 */
CrouchingSprite.prototype.isCrouching = function() {
    return this.zIndex === CROUCH;
}

/**
 * @summary Copy given sprite's info.
 * @see {@link ./cloneable_sprite.js CloneableSprite}
 * @param object sprite to copy.
 * @return this.
 */
CrouchingSprite.prototype.copySpriteInfo = function(info) {
    _super.copySpriteInfo.call(this,info);
    this.zIndex = info.zIndex;
    return this;
}

module.exports = CrouchingSprite;