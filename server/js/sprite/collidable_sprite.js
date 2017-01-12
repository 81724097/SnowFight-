var Sprite = require('./sprite.js');
var Constants = require('../constants.js');

/**
 * @summary Sprite that can move and collide
 *
 * Adds collision support to the Sprite class
 * @see Sprite
 *
 * @class
 * @augments Sprite,InputSprite,Circle
 * @mixes Rectangle
 *
 * @param int x coordinate
 * @param int y coordinate
 * @param int radius size
 * @param int velocity
 * @param int dir (-1 means stop)
 */
var CollidableSprite = function(x,y,radius,velocity,dir) {
    Sprite.call(this,x,y,radius,velocity,dir);
    this.collidable = true;
    this.damagable = true;
}

CollidableSprite.prototype = Object.create(Sprite.prototype);
CollidableSprite.prototype.constructor = CollidableSprite;
var _super = Object.getPrototypeOf(CollidableSprite.prototype);

/**
 * @summary moves this sprite
 *
 * Moves this sprite according to the given velocity and this.dir unless this.dir < 0
 * then calls this.boundaryCollision() and this.spriteCollisions()
 *
 * @param int velocity.
 */
CollidableSprite.prototype.move = function(velocity) {
    _super.move.call(this,velocity);
    this.boundaryCollision();
    this.spriteCollisions();
}

/**
 * @summary Determines what happens when this collides with other sprites.
 *
 * called when this sprite and another sprite collides with each other
 * (at the moment, this method is called twice i.e. this.hitSprite(sprite) and sprite.hitSprite(this))
 *
 * @param object sprite that collided with this sprite.
 */
CollidableSprite.prototype.hitSprite = function(sprite) {
    if (sprite.type === "PLAYER")
        this.hitPlayer(sprite);
    else if (sprite.type === "PROJECTILE")
        this.hitProjectile(sprite);
    else if (sprite.type === "SNOW_WALL")
        this.hitSnowWall(sprite);
    else if (sprite.type === "SNOW_MAN")
        this.hitSnowMan(sprite);
    else if (sprite.type === "SNOW_PILE")
        this.hitSnowPile(sprite);
}   
/**
 * @summary Determines what happens when this collides with players.
 *
 * Called when this sprite collides with a player
 *
 * @param object sprite that collided with this sprite.
 */
CollidableSprite.prototype.hitPlayer = function(sprite) { // Override this method
    // PUT CODE HERE WHEN THIS HITS PLAYER
}   
/**
 * @summary Determines what happens when this collides with projectiles.
 *
 * Called when this sprite collides with a projectile
 *
 * @param object sprite that collided with this sprite.
 */
CollidableSprite.prototype.hitProjectile = function(sprite) { // Override this method
    // PUT CODE HERE WHEN THIS HITS PROJECTILE
}   
/**
 * @summary Determines what happens when this collides with snow walls.
 *
 * Called when this sprite collides with a snow wall
 *
 * @param object sprite that collided with this sprite.
 */
CollidableSprite.prototype.hitSnowWall = function(sprite) { // Override this method
    // PUT CODE HERE WHEN THIS HITS SNOW_WALL
}   
/**
 * @summary Determines what happens when this collides with a snow man.
 *
 * Called when this sprite collides with a snow man
 *
 * @param object sprite that collided with this sprite.
 */
CollidableSprite.prototype.hitSnowMan = function(sprite) { // Override this method
    // PUT CODE HERE WHEN THIS HITS SNOW_WALL
}   
/**
 * @summary Determines what happens when this collides with snow piles.
 *
 * Called when this sprite collides with a snow pile
 *
 * @param object sprite that collided with this sprite.
 */
CollidableSprite.prototype.hitSnowPile = function(sprite) { // Override this method
    // PUT CODE HERE WHEN THIS HITS SNOW_PILE
}

/**
 * @summary Determines what happens when this collides with players.
 *
 * Called when this sprite collides with a player
 *
 * @param object collision where collision.x and collision.y are the components of the direction to move this sprite back onto field
 */
CollidableSprite.prototype.hitBoundary = function(collision) { // Override this method
    // PUT CODE HERE WHEN THIS HITS WALL
}

/**
 * @summary Returns true if collided with a sprite, else false.
 *
 * Calls all the collision methods: this.extraSpriteCollisions() and this.hitSprite()
 * Keeps this sprite from walking into collidable sprites
 *
 * @return true if collided with a sprite, else false.
 */
CollidableSprite.prototype.spriteCollisions = function() {
    var sprites = this.sprites || Constants.sprites;
    var b = false;
    if ( sprites )
    {
        for (var i = 0; i < sprites.length; i++) {
            for (var j = 0; j < sprites[i].length; j++) {
                var s = sprites[i][j];
                if (s && s !== this && s.collidable)
                {
                    var collision = this.overlaps(s); // this.calculateReturnDistance(s);
                    if (collision && this.extraSpriteCollisions(s))
                    {
                        this.translateDirection(collision,this.getAngle(s) + 180);
                        this.hitSprite(s);
                        // s.hitSprite(this); // NOTE: may not be needed
                        b = true;
                    }
                }
            }
        }
    }
    return b;
}

/**
 * @summary Returns true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision) 
 *
 * note: calculations may be duplicated in this method when both this.collide(sprite) and sprite.collide(this) does the same calculations
 *
 * @param object sprite
 * @return true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision)
 */
CollidableSprite.prototype.extraSpriteCollisions = function(sprite) {
    return sprite.otherSpriteCollisions(this);
}

/**
 * @summary Returns true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision) 
 *
 * note: calculations may be duplicated in this method when both this.collide(sprite) and sprite.collide(this) does the same calculations
 *
 * @param object sprite
 * @return true if all other sprite conditions are met (allowing the collision to continue) else false (failing to consider it a collision)
 */
CollidableSprite.prototype.otherSpriteCollisions = function(sprite) { // to be overridden so that subclasses can fully control this collision
    return true;
}

/**
 * @summary Return true if hit the boundary else false.
 *
 * Calls this.hitBoundary if collided with boundary.
 *
 * @return true if hit the boundary else false.
 */
CollidableSprite.prototype.boundaryCollision = function() {
    var collision = this.notWithin(this.bounds || Constants.bounds);
    if ( collision )
    {
        this.translatePosition( collision.x, collision.y );
        this.hitBoundary(collision);
        return true;
    }
    return false;
}

/**
 * @summary Returns an object that contains this sprite's info (variables).
 *
 * @return an object that contains this sprite's info (variables).
 */
CollidableSprite.prototype.getInfo = function() {
    var s = _super.getInfo.call(this);
    s.collidable = this.collidable;
    s.damagable = this.damagable;
    return s;
}

module.exports = CollidableSprite;