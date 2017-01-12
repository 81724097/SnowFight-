var CloneableSprite = require('./cloneable_sprite.js');
var Constants = require('../constants.js');

/**
 * @summary Basic sprite that can move and collide
 *
 * Basic Sprite that can move, extends the Button for mouse and keyboard implementations
 * Can be contained within a rectangle (to represent a world) by setting Sprite.bounds = new Rectangle()
 * Can collide with any sprite or circle
 *
 * @class
 * @augments CloneableSprite,CollidableSprite,Sprite,Button,Circle
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
var StatsSprite = function(x,y,radius,velocity,dir, maxHp, atk) {
    CloneableSprite.call(this,x,y,radius,velocity,dir);
    this.setStats(maxHp,atk);
}

StatsSprite.prototype = Object.create(CloneableSprite.prototype);
StatsSprite.prototype.constructor = StatsSprite;
var _super = Object.getPrototypeOf(StatsSprite.prototype);

/**
 * @summary Sets the sprite stats
 *
 * Sets this sprite's stats to given maxHp and atk
 *
 * @param int maxHp
 * @param int atk.
 * @return this.
 */
StatsSprite.prototype.setStats = function(maxHp,atk) {
    this.maxHp = maxHp || Constants.DEFAULT_MAXHP;
    this.hp = this.maxHp;
    this.atk = atk || Constants.DEFAULT_ATK;
    return this;
}

/**
 * @summary Returns an object with this sprite's stats
 *
 * Returns an object with this sprite's maxHp, hp and atk where they can be received by:
 *      object.maxHp
 *      object.hp
 *      object.atk
 *
 * @return an object with this sprite's stats
 */
StatsSprite.prototype.getStats = function() {
    return {maxHp: this.maxHp, 
            hp: this.hp, 
            atk: this.atk};
}

// 
/**
 * @summary makes this sprite take damage from the given sprite then returns the damage taken
 *
 * this method calculates the amount of damage this sprite should take from the given sprite 
 * (most likely a projectile) and returns the amount of damage taken
 *
 * @param {Object} sprite
 * @return int amount of damage taken
 */
StatsSprite.prototype.takeDamage = function(sprite) {
    if (this.damagable) {
        var damage = sprite.atk;
        this.hp -= damage;
        if (this.hp <= 0)
            this.die();
        return damage;
    }
    return 0;
}

/**
 * @summary Copy given sprite's info.
 * @see {@link ./cloneable_sprite.js CloneableSprite}
 * @param object sprite to copy.
 * @return this.
 */
StatsSprite.prototype.copySpriteInfo = function(info) {
    _super.copySpriteInfo.call(this,info);
    StatsSprite.prototype.copySpriteStats.call(this,info); // used this way for compatability with sprite like objects
    return this;
}

/**
 * @summary copy the given object's info
 * @see {@link StatsSprite.prototype#copySpriteInfo}
 * @param object sprite to copy.
 * @return this.
 */
StatsSprite.prototype.copySpriteStats = function(stats) {
    StatsSprite.prototype.setStats.call(this,stats.maxHp,stats.atk); // used this way for compatability with sprite like objects
    this.hp = stats.hp;
}

module.exports = StatsSprite;