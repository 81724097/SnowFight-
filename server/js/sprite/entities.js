
var GameSprite = require('./game_sprite.js');
var Constants = require('../constants.js');

/**
 * @summary SnowMan
 *
 *
 * @class
 * @augments GameSprite,TimedSprite,CrouchingSprite,CloneableSprite,CollidableSprite,Sprite,InputSprite,Circle
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
var Entities = function(x,y,radius,dir,time,maxHp,atk) {
    GameSprite.call(this,x,y,radius,0,dir,time,maxHp,atk);
    this.type = "Entity";
    this.damagable = false;
    var s = this;
    this.timedFunction = function() { s.disappear(); };
}

Entities.prototype = Object.create(GameSprite.prototype);
Entities.prototype.constructor = Entities;
var _super = Object.getPrototypeOf(Entities.prototype);

/**
 * @summary Shrinks this sprite by decreasing hp
 *
 * if hp <= 0, calls this.disappear()
 */
Entities.prototype.shrink = function() {
    this.hp--;
    if (this.hp <= 0)
        this.disappear();
}

/**
 * @summary Gives snow to the given sprite
 *
 * Gives the amount of snow this sprite has (this.snow) to the sprite unless this is dead
 * Calls this.shrink
 *
 * @param {Object} sprite.
 */
Entities.prototype.giveSnow = function(sprite) {
    if (this.isDead) return;
    if (sprite.receiveSnow(this));
        this.shrink();
}

/**
 * @summary Called when this sprite and another snow man collide with each other.
 *
 * @param {Object} sprite.
 */
Entities.prototype.hitSnowMan = function(sprite) {
    sprite.hp = Math.min(this.hp + sprite.hp,sprite.maxHp);
    sprite.startTimers();
    this.disappear();
}

/**
 * @summary Determines what happens when this collides with the boundary.
 *
 * Called when this sprite collides with the boundary
 *
 * @param {Object} collision where collision.x and collision.y are the components of the direction to move this sprite back onto field
 */
Entities.prototype.hitBoundary = function(collision) {
    this.disappear();
}

module.exports = Entities;