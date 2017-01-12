
var Entities = require('./entities.js');
var Constants = require('../constants.js');

/**
 * @summary SnowMan
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
var SnowMan = function(x,y,radius,dir,time,maxHp,atk) {
    Entities.call(this,x,y,radius,dir,time,maxHp,atk);
    this.type = "SNOW_MAN";
    this.snow = Constants.DEFAULT_PILE_SNOW;
    this._range = {x:this.x,y:this.y,radius:this.radius + Constants.DEFAULT_SNOW_MAN_RANGE};
}

SnowMan.prototype = Object.create(Entities.prototype);
SnowMan.prototype.constructor = SnowMan;
var _super = Object.getPrototypeOf(SnowMan.prototype);

/**
 * @summary Returns true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision) 
 *
 * note: calculations may be duplicated in this method when both this.collide(sprite) and sprite.collide(this) does the same calculations
 *
 * @param {Object} sprite
 * @return true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision)
 */
SnowMan.prototype.extraSpriteCollisions = function(sprite) { // the collision only occurs if the sprite is not from this projectile's origin player
    if (sprite.type === "PLAYER") {
        if (this.overlaps(sprite)) {
            sprite.snowPile = this;
        }
    }
    else if (sprite.type === "PROJECTILE") { // let projectiles do the colliding (note: voids the hitProjectile method so must be called here)
        this.hitProjectile(sprite);
        return false;
    }
    return true;
}

module.exports = SnowMan;