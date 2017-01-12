var Character = require('./character.js');
var Keys = require('../keys.js');

function leftClick() {
	this.shootAt(this.mouse);
}

function middleClick() {
	console.log(this.text + " middleClicked");
}

function rightClick() {
	// this.pickSnow();
}

/**
 * @summary Sprite that supports input
 *
 * @class
 * @augments Character,GameSprite,TimedSprite,CrouchingSprite,CloneableSprite,CollidableSprite,Sprite,Button,Circle
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
var Player = function(x,y,radius,velocity,dir,time,maxHp,atk) {
	Character.call(this,x,y,radius,velocity,dir,time,maxHp,atk);
	this.input = [0,0,0,0,0,0,0];
	this.handler[0] = leftClick;
	this.handler[1] = middleClick;
	this.handler[2] = rightClick;
	this._upKey = Keys.W;
	this._leftKey = Keys.A;
	this._downKey = Keys.S;
	this._rightKey = Keys.D;
	this._crouchKey = Keys.SHIFT;
	this._placeKey = Keys.SPACE;
	this._pickKey = Keys.Z // set this for picking snow
	this._upKeyAlt = Keys.UP;
	this._leftKeyAlt = Keys.LEFT;
	this._downKeyAlt = Keys.DOWN;
	this._rightKeyAlt = Keys.RIGHT;
	// this._crouchKeyAlt = Keys.SHIFT;
	// this._placeKeyAlt = Keys.SPACE;
	// this._pickKeyAlt = Keys. // set this for picking snow

	this.keyHandler = function() {
		this.input[Player.UP] = this.keys.isDown(this._upKey) || this.keys.isDown(this._upKeyAlt) ? 1 : 0;
		this.input[Player.LEFT] = this.keys.isDown(this._leftKey) || this.keys.isDown(this._leftKeyAlt) ? 1 : 0;
		this.input[Player.DOWN] = this.keys.isDown(this._downKey) || this.keys.isDown(this._downKeyAlt) ? 1 : 0;
		this.input[Player.RIGHT] = this.keys.isDown(this._rightKey) || this.keys.isDown(this._rightKeyAlt) ? 1 : 0;
		this.input[Player.CROUCH] = this.keys.isDown(this._crouchKey) ? 1 : 0;
		this.input[Player.PLACE] = this.keys.isDown(this._placeKey) ? 1 : 0;
		this.input[Player.PICK] = this.keys.isDown(this._pickKey) ? 1 : 0;
	}
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
var _super = Object.getPrototypeOf(Player.prototype);

Player.UP = 0;
Player.LEFT = 1;
Player.DOWN = 2;
Player.RIGHT = 3;
Player.CROUCH = 4;
Player.PLACE = 5;
Player.PICK = 6;

/**
 * @summary updates the player by calling sprite.update with input directions.
 *
 * Sets this.dir to this.getDirection()
 */
Player.prototype.update = function() {
	this.dir = this.getDirection();
	this.processKeys();
	_super.update.call(this);
}

/**
 * @summary processes miscellaneous keys for miscellaneous actions
 *
 * Calls this.placeWall(), this.pickSnow(), and this.crouch()/this.stand() based on key input
 */
Player.prototype.processKeys = function() {
	if (this.input[Player.PLACE])
		this.placeWall();
	if (this.input[Player.PICK])
		this.pickSnow();
	if (this.input[Player.CROUCH])
		this.crouch();
	else
		this.stand();
}

/**
 * @summary Returns a direction (in degrees) based on input where 0 is right and 90 is down
 *
 * @return a direction (in degrees) based on input.
 */
Player.prototype.getDirection = function() {
	// take the difference of the same directions so that they cancel if both are pressed
	var dx = this.input[Player.LEFT] - this.input[Player.RIGHT];
	var dy = this.input[Player.DOWN] - this.input[Player.UP];
	// formulaic method
	var a = dx === 0;
	var b = dy === 0;
	if ( a && b )
		return -1;
	dx = dx * 90 + 90; // convert from (-1,0,1) to degrees based on direction
	dy = (dy * 90 + 360) % 360;

	if ( dy === 270 && dx === 0 )
		dx = 360;
	if ( a ) dx = dy; // if either direction is 0, set it to the other direction
	if ( b ) dy = dx;

	return (dx + dy)/2; // average the x and y directions
}

/**
 * @summary Copy given sprite's info.
 * @see {@link ./cloneable_sprite.js CloneableSprite}
 * @param object sprite to copy.
 * @return this.
 */
Player.prototype.copySpriteInfo = function(info) {
    _super.copySpriteInfo.call(this,info);
    this.killer = info.killer;
}

module.exports = Player;