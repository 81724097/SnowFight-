var TimedSprite = require('./timed_sprite.js');
var Constants = require('../constants.js');
var Cloner = require('../cloner.js');

/**
 * @summary Sprite that can shoot, place wall, and pick snow
 *
 * This sprite can shoot, place wall, and pick snow by calling their respective methods:
 *      @see GameSprite.prototype.shoot()
 *      @see GameSprite.prototype.placeWall()
 *      @see GameSprite.prototype.pickSnow()
 *
 * @class
 * @augments TimedSprite,CrouchingSprite,CloneableSprite,CollidableSprite,Sprite,InputSprite,Circle
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
var GameSprite = function(x,y,radius,velocity,dir,time, maxHp, atk) {
    TimedSprite.call(this,x,y,radius,velocity,dir,time,maxHp,atk);
    this.points = 0;
    this._canShoot = true;
    this._canPlaceWall = true;
    this._canPickSnow = true;
    this.stand();
    this.snow = Constants.DEFAULT_STARTING_SNOW;
    this.snowPile = false;
}

GameSprite.prototype = Object.create(TimedSprite.prototype);
GameSprite.prototype.constructor = GameSprite;
var _super = Object.getPrototypeOf(GameSprite.prototype);

/**
 * @summary Receives snow from given sprite
 *
 * Adds sprite.snow to this.snow then clamps it to this.maxSnow if this.maxSnow is set
 *
 * @param {Object} sprite.
 */
GameSprite.prototype.receiveSnow = function(sprite) {
    var snow = this.snow;
    this.snow += sprite.snow;
    this.snow = Math.min(this.snow,this.maxSnow) || this.snow;
    return this.snow > snow;
}

/**
 * @summary Tries to shoot, returns the projectile it shot if successful else returns false.
 *
 * Limited by Constants.DEFAULT_SHOOT_DELAY
 * Can only shoot if time between shots is >= Constants.DEFAULT_SHOOT_DELAY and if the cost will not make this.snow < 0
 *
 * @param {number} dir - direction to shoot
 * @return the projectile it shot if successful else returns false.
 */
GameSprite.prototype.shoot = function(dir) {
    if (!this._canShoot || this.snow - Constants.DEFAULT_PROJ_COST < 0 || this.isCrouching()) return false;
    this.snow -= Constants.DEFAULT_PROJ_COST;
    var proj = Cloner.cloneProjectile(this.projectile,this.x,this.y,null,null,(dir + 360) % 360);
    proj.mySprite = this;
    Constants.engine.add(Constants.PROJECTILES,proj);
    this._canShoot = false;
    var s = this;
    this.shootTimer = this.setTimer(this.shootTimer,function() { s._canShoot = true; }, Constants.DEFAULT_SHOOT_DELAY);
    return proj;
}   
/**
 * @summary Tries to shoot, returns the projectile it shot if successful else returns false.
 *
 * Calls the this.shoot() with this.getAngle(sprite)
 * @see GameSprite.prototype.shoot() 
 * @see Circle.prototype.getAngle()
 * @param {Object} sprite - Sprite to shoot at (any object with x and y property will work too)
 * @return the projectile it shot if successful else returns false.
 */
GameSprite.prototype.shootAt = function(sprite) {
    return this.shoot(this.getAngle(sprite));
}

/**
 * @summary Tries to place a wall, returns the wall it placed if successful else returns false.
 *
 * Limited by Constants.DEFAULT_PLACE_WALL_DELAY
 * Can only shoot if time between placing is >= Constants.DEFAULT_PLACE_WALL_DELAY and if the cost will not make this.snow < 0
 *
 * @return the wall it placed if successful else returns false.
 */
GameSprite.prototype.placeWall = function() {
    if (!this._canPlaceWall || this.snow - Constants.DEFAULT_WALL_COST < 0) return false;
    this.snow -= Constants.DEFAULT_WALL_COST;
    var wall = Cloner.cloneSnowWall(this.wall,this.x,this.y,null,this.dirFacing);
    wall.translateDirection(this.radius+wall.radius,this.dirFacing);
    Constants.engine.add(Constants.SNOW_WALLS, wall);
    this._canPlaceWall = false;
    var s = this;
    this.wallTimer = this.setTimer(this.wallTimer,function() { s._canPlaceWall = true; }, Constants.DEFAULT_PLACE_WALL_DELAY);
    return wall;
}

/**
 * @summary Tries to pick snow, returns the snow pile it picked from if successful else returns false.
 *
 * Limited by Constants.DEFAULT_PICK_SNOW_DELAY
 * Can only pick snow if time between picking snow is >= Constants.DEFAULT_PICK_SNOW_DELAY and if this is on a snow pile
 *
 * @return the snow pile it picked from if successful else returns false.
 */
GameSprite.prototype.pickSnow = function() {
    if (!this._canPickSnow || !this.snowPile) return false; // don't pick snow unless the delay has passed and standing on a snowPile and 
    this.snowPile.giveSnow(this);
    this._canPickSnow = false;
    var s = this;
    this.pickTimer = this.setTimer(this.pickTimer,function() { s._canPickSnow = true; }, Constants.DEFAULT_PICK_SNOW_DELAY); // start delay
    return this.snowPile;
}

/**
 * @summary Copy given sprite's info.
 * @see {@link ./cloneable_sprite.js CloneableSprite}
 * @param object sprite to copy.
 * @return this.
 */
GameSprite.prototype.copySpriteInfo = function(info) {
    _super.copySpriteInfo.call(this,info);
    this.points = info.points;
    this.snow = info.snow;
    this.maxSnow = info.maxSnow;
}

module.exports = GameSprite;