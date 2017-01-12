var CollidableSprite = require('./collidable_sprite.js');

/**
 * @summary Sprite that can clone itself
 *
 * Adds cloning capabilities to the Sprite (methods should be overridden by subclasses)
 *
 * @class
 * @augments CollidableSprite,Sprite,InputSprite,Circle
 * @mixes Rectangle
 *
 * @param int x coordinate
 * @param int y coordinate
 * @param int radius size
 * @param int velocity
 * @param int dir (-1 means stop)
 */
var CloneableSprite = function(x,y,radius,velocity,dir) {
    CollidableSprite.call(this,x,y,radius,velocity,dir);
}

CloneableSprite.prototype = Object.create(CollidableSprite.prototype);
CloneableSprite.prototype.constructor = CloneableSprite;
var _super = Object.getPrototypeOf(CloneableSprite.prototype);

/**
 * @summary copy the given object's info
 *
 * @param object sprite to copy.
 * @return this.
 */
CloneableSprite.prototype.copySpriteInfo = function(info) {
    this.type = info.type || this.type;
    this.text = info.text || this.text;
    this.x = info.x || this.x;
    this.y = info.y || this.y;
    this.radius = info.radius || this.radius;
    this.velocity = info.velocity || this.velocity;
    this.dir = info.dir || this.dir; // 0 = EAST, 90 = SOUTH, 180 = WEST, 270 = NORTH, -1 = stop
    this.dirFacing = info.dirFacing || this.dirFacing; // 0 = EAST, 90 = SOUTH, 180 = WEST, 270 = NORTH, -1 = stop
    this.collidable = info.collidable || this.collidable;
    this.damagable = info.damagable || this.damagable;
    this.isDead = info.isDead;
    return this;
}

/**
 * @summary Creates and returns a copy of this
 *
 * @param object class subclass to use to copy.
 * @return copy.
 */
CloneableSprite.prototype.createCopy = function(SubClass) {
    return CloneableSprite.copy(this,SubClass);
}

/**
 * @summary Creates and returns a copy of given sprite
 *
 * @param object sprite to copy.
 * @param object class subclass to use to copy.
 * @return copy.
 */
CloneableSprite.copy = function(s, SubClass) {
    var Class = SubClass || s.constructor;
    var sprite = new Class();
    sprite.copySpriteInfo(s);
    return sprite;
}

/**
 * @summary Returns an object that contains this sprite's info (variables).
 *
 * @return an object that contains this sprite's info (variables).
 */
CloneableSprite.prototype.getInfo = function() {
    var s = _super.getInfo.call(this);
    this.copySpriteInfo.call(s,this);
    return s;
}

module.exports = CloneableSprite;