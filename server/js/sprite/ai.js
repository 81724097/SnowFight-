
var Character = require('./character.js');
var Constants = require('../constants.js');
function getSprites(type,typeName) {
	var sprites = [];
	for (var i = 0; i < Constants.sprites[type].length; i++) {
		var s = Constants.sprites[type][i];
		if (s && s.type == typeName && s != this && (!s.mySprite || s.mySprite != this))
			sprites.push(s);
	}
	return sprites;
}

// to access sprites use: Constants.sprites[type][index] or Constants.engine.gameObjects[type][index]	

/**
 * @summary Sprite with AI
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
var AISprite = function(x,y,radius,velocity,dir,time,maxHp,atk) {
	Character.call(this,x,y,radius,velocity,dir,time,maxHp,atk);
}

AISprite.prototype = Object.create(Character.prototype);
AISprite.prototype.constructor = AISprite;
var _super = Object.getPrototypeOf(AISprite.prototype);

// you can override the update method and/or the move method if you need more control	

AISprite.prototype.move = function() {
	this.dir = this.getDirection();
	_super.move.call(this);
	this.act();
}

AISprite.prototype.getDirection = function()
{
	var players = this.getAllPlayerObjects();
	var target = this.findClosestSprite(players);
	var pile = this.findClosestSprite(this.getPiles());

	var movement = -1;
	if (target) {
		var playerDistance = this.getDistance(target);
		var bullets = this.getAllProjectiles();
		var closestBullet = this.findClosestSprite(bullets);
	
		if(closestBullet && closestBullet.getDistance(this) < playerDistance)
		{
			movement = this.avoidShot(closestBullet);
			if(movement == -1 && this.snow >= 2)
			{
				this.dir = (this.getAngle(target) + 360) % 360;
				this.updateDirFacing();
				this.placeWall();

				this.crouch();
				var s = this;
				setTimeout(function() {s.stand();},3000);
			}
		}
		else if(pile && (this.snow == 0 || playerDistance > 200))
		{
			movement = (this.getAngle(pile) + 360) % 360;
			this.pickSnow();
		}
		else
		{
			if(this.getDistance(target) > 155)
			{
				movement = (this.getAngle(target) + 360) % 360;	
			}
			else if(this.getDistance(target) < 130)
			{
				movement = movement + 180;
				movement %= 360;
			}
		}
	}
	return movement;
}

AISprite.prototype.avoidShot = function(bullet)
{
	if(this.getDistance(bullet) < 110)
	{
		return -1;
	}

	var directionToMove = bullet.dir + 90;
	var dir = Constants.toRadians(directionToMove);
	if(this.getDistance({x:this.x + Math.cos(dir), y: this.y + Math.sin(dir)}) < this.getDistance(bullet))
	{
		directionToMove = bullet.dir - 90;
	}
	return (directionToMove + 360) % 360;
}

AISprite.prototype.act = function()
{
	if(!this._canShoot || Constants.sprites[Constants.PLAYERS].length == 0) return;
	var players = this.getAllPlayerObjects();
	var targetPlayer = this.findClosestSprite(players);

	if(targetPlayer && this.getDistance(targetPlayer) < 200)
	{
		this.shootAt(targetPlayer);
	}
}

AISprite.prototype.getPiles = function() {
	return getSprites.call(this,Constants.SNOW_PILES,"SNOW_PILE");
}

AISprite.prototype.getAllProjectiles = function() {
	return getSprites.call(this,Constants.PROJECTILES,"PROJECTILE");
}

AISprite.prototype.getAllPlayerObjects = function()
{
	var players = getSprites.call(this,Constants.PLAYERS,"PLAYER");
	var sprites = getSprites.call(this,Constants.SPRITES,"PLAYER");
	return players.concat(sprites);
}

AISprite.prototype.findClosestSprite = function(players)
{
	var distances = new Array(players.length);
	
	for(var i = 0; i < players.length; i++)
	{
		distances[i] = this.getDistance(players[i]);
	}

	var minIndex = 0;

	for(var i = 0; i < distances.length; i++)
	{
		if(distances[i] < distances[minIndex])
		{
			minIndex = i;
		}
	}
	return players[minIndex];
}

// called when this sprite and another sprite collides with each other
// AISprite.prototype.hitSprite = function(sprite) { // this is a lower level method that calls all the other methods (see Sprite for implementation)
// 	// console.log(this + " collided with " + sprite);
// 	// PUT WHAT HAPPENS WHEN SPRITES COLLIDE HERE
// }
AISprite.prototype.hitPlayer = function(sprite) { // Override this method
	// PUT CODE HERE WHEN THIS HITS PLAYER
}
AISprite.prototype.hitProjectile = function(sprite) { // Override this method
	// PUT CODE HERE WHEN THIS HITS PROJECTILE
}
AISprite.prototype.hitSnowWall = function(sprite) { // Override this method
	// PUT CODE HERE WHEN THIS HITS SNOW_WALL
}
AISprite.prototype.hitSnowMan = function(sprite) { // Override this method
	// PUT CODE HERE WHEN THIS HITS SNOW_WALL
}
AISprite.prototype.hitSnowPile = function(sprite) { // Override this method
	// PUT CODE HERE WHEN THIS HITS SNOW_PILE
}
AISprite.prototype.hitBoundary = function(collision) {
	// PUT CODE HERE WHEN THIS HITS WALL
}

module.exports = AISprite;