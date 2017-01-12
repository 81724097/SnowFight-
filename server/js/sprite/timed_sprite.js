var CrouchingSprite = require('./crouching_sprite.js');

/**
 * @summary Sprite that supports timers
 *
 * Basic sprite that can support timers by using the setTimer() method
 * The main timer works by calling startTimers() after setting this.timedFunction to a function
 *
 * @class
 * @augments CrouchingSprite,CloneableSprite,CollidableSprite,Sprite,Button,Circle
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
var TimedSprite = function(x,y,radius,velocity,dir,time,maxHp,atk) {
    CrouchingSprite.call(this,x,y,radius,velocity,dir,maxHp,atk);
    this.time = time;
    this.stand();
}

TimedSprite.prototype = Object.create(CrouchingSprite.prototype);
TimedSprite.prototype.constructor = TimedSprite;
var _super = Object.getPrototypeOf(TimedSprite.prototype);
    
/**
 * @summary Starts the main timers
 */
TimedSprite.prototype.startTimers = function() {
    this._timer = this.setTimer(this._timer, this.timedFunction,this.time);
}

/**
 * @summary Clears the old timer, runs the given function with the given time delay  
 *
 * @param {Object} oldTimer.
 * @param {function} funct.
 * @return {number} time - delay in milliseconds.
 */
TimedSprite.prototype.setTimer = function(oldTimer,funct,time) {
    clearTimeout(oldTimer);
    if (time > 0)
        return setTimeout(funct, time);
}   
/**
 * @summary kills this sprite and clears main timer
 *
 * Calls the this.die() and clearTimeout(this._timer)
 * @see Sprite.prototype#die
 */
TimedSprite.prototype.disappear = function() {
    clearTimeout(this._timer);
    this.die();
}

/**
 * @summary Copy given sprite's info.
 * @see {@link ./cloneable_sprite.js CloneableSprite}
 * @param object sprite to copy.
 * @return this.
 */
TimedSprite.prototype.copySpriteInfo = function(info) {
    _super.copySpriteInfo.call(this,info);
    this.time = info.time;
    return this;
}

module.exports = TimedSprite;