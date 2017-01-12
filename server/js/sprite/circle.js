
var Constants = require('../constants.js');

/**
 * @summary Basic circle
 *
 * @class
 * @mixes Rectangle
 *
 * @param int x coordinate
 * @param int y coordinate
 * @param int radius size
 */
var Circle = function(x, y, radius) {
    this.set(x, y, radius);
}
    
/**
 * @summary sets the x,y,radius
 *
 * sets x,y,radius to given parameters else 0
 *
 * @param int x coordinate (center of this circle)
 * @param int y coordinate (center of this circle)
 * @param int radius size
 * @return this.
 */
Circle.prototype.set = function(x, y, radius) {
    this.x = x || this.x || 0;
    this.y = y || this.y || 0;
    this.radius = radius || this.radius || 0;
    return this;
}

/**
 * @summary Returns the left side of the rectangle that this circle would be inscribed in.
 *
 * this.x - this.radius
 *
 * @return left side of bounding rectangle.
 */
Circle.prototype.leftSide = function() {
    return this.x - this.radius;
}

/**
 * @summary Returns the top side of the rectangle that this circle would be inscribed in.
 *
 * this.y - this.radius
 *
 * @return top side of bounding rectangle.
 */
Circle.prototype.topSide = function() {
    return this.y - this.radius;
}

/**
 * @summary Returns the right side of the rectangle that this circle would be inscribed in.
 *
 * this.x + this.radius
 *
 * @return right side of bounding rectangle.
 */
Circle.prototype.rightSide = function() {
    return this.x + this.radius;
}

/**
 * @summary Returns the bottom side of the rectangle that this circle would be inscribed in.
 *
 * this.y + this.radius
 *
 * @return bottom side of bounding rectangle.
 */
Circle.prototype.bottomSide = function() {
    return this.y + this.radius;
}

/**
 * @summary Returns true if this is not within the given rectangle else 0 (considered false)
 *
 * Returns a collision object if this is not within the given rectangle such that:
 *      collision.x and collision.y are set to the components of the closest distance in which this circle would be inside the rectangle
 *
 * @param rectangle.
 * @return true if this is not within the given rectangle else 0 (considered false)
 */
Circle.prototype.notWithin = function(c) {
    var dx = 0;
    var dy = 0;
    if ( c )
    {
        if (c.leftSide()   > this.leftSide())   dx = this.leftSide()   - c.leftSide(); 
        if (c.rightSide()  < this.rightSide())  dx = this.rightSide()  - c.rightSide();
        if (c.topSide()    > this.topSide())    dy = this.topSide()    - c.topSide();
        if (c.bottomSide() < this.bottomSide()) dy = this.bottomSide() - c.bottomSide();
    }
    return (dx || dy) ? { x: -dx, y: -dy } : 0;
}

/**
 * @summary Returns true if this Circle overlaps the given Circle else 0.
 *
 * Returns Math.max(this.radius + c.radius - this.getDistance(c), 0)
 *
 * @param Circle c
 * @return true if this Circle overlaps the given Circle.
 */
Circle.prototype.overlaps = function(c) {
    return Math.max(this.radius + c.radius - this.getDistance(c), 0);
}
    
/**
 * @summary Returns true if the given circle is outside this circle else false.
 *
 * Returns !this.overlaps(c)
 * @see Circle.prototype.overlaps
 *
 * @param Circle c
 * @return true if the given circle is outside this circle else false.
 */
Circle.prototype.outside = function(c) {
    return !this.overlaps(c);
}
    
/**
 * @summary Returns the distance between this and the given circle.
 *
 * Uses the center of both circles (this.x,this.y,c.x,c.y)
 * @see Constants.getDistance()
 *
 * @param Circle c
 * @return the distance between this and the given circle.
 */
Circle.prototype.getDistance = function(c) {
    return Constants.getDistance(this.x,this.y,c.x,c.y);
}
    
/**
 * @summary Returns the angle between this and the given circle. (in degrees)
 *
 * Returns the angle between this and the given circle such that 0 points to the right and 90 points down
 *
 * @param Circle c
 * @return the angle between this and the given circle. (in degrees)
 */
Circle.prototype.getAngle = function(c) {
    return Constants.getAngle(this.x,this.y,c.x,c.y);
}

module.exports = Circle;