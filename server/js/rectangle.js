
var Rectangle = function(x, y, width, height) {
    this.set(x, y, width, height);
}

Rectangle.prototype.set = function(x, y, width, height){
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || this.width || 0;
    this.height = height || this.height || 0;
}

// returns y coordinate or where the top side of this rectangle is
Rectangle.prototype.centerX = function() {
    return this.x + this.width / 2;
}

// returns y coordinate or where the top side of this rectangle is
Rectangle.prototype.centerY = function() {
    return this.y + this.height / 2;
}

// returns x coordinate or where the left side of this rectangle is
Rectangle.prototype.leftSide = function() {
    return this.x;
}

// returns y coordinate or where the top side of this rectangle is
Rectangle.prototype.topSide = function() {
    return this.y;
}

// returns (x + width) coordinate or where the right side of this rectangle is
Rectangle.prototype.rightSide = function() {
    return this.x + this.width;
}

// returns (y + height) coordinate or where the bottom side of this rectangle is
Rectangle.prototype.bottomSide = function() {
    return this.y + this.height;
}

// returns whether or not the given rectangle r completely encompasses this rectangle
Rectangle.prototype.within = function(r) {
    return !this.notWithin();
}

// returns 0 if this is within the given rectangle, else the closest x or y difference that would put this in the given rectangle
Rectangle.prototype.notWithin = function(r) {
    if ( r )
    {
        if (r.leftSide()   > this.leftSide())   return this.leftSide()   - r.leftSide(); 
        if (r.rightSide()  < this.rightSide())  return this.rightSide()  - r.rightSide();
        if (r.topSide()    > this.topSide())    return this.topSide()    - r.topSide();
        if (r.bottomSide() < this.bottomSide()) return this.bottomSide() - r.bottomSide();
    }
    return 0;
}

// Rectangle.prototype.calculateXOverlap = function(r) {
//     return calculateOverlap(this.x,r.x,this.width,r.width);
// }

// Rectangle.prototype.calculateYOverlap = function(r) {
//     return calculateOverlap(this.y,r.y,this.height,r.height);
// }

// returns whether or not this rectangle overlaps the given rectangle r
Rectangle.prototype.overlaps = function(r) {
    return (this.leftSide() < r.rightSide() && 
            r.leftSide() < this.rightSide() && 
            this.topSide() < r.bottomSide() &&
            r.topSide() < this.bottomSide());
}

Rectangle.prototype.outside = function(r) {
    return !this.overlaps(r);
}

// calculates overlap in one direction where start1 and size1 is the main rectangle's x/y and width/height
// and start2 and size2 is the compared to rectangle's x/y and width/height respectively
// function calculateOverlap(start1,start2,size1,size2) {
//     return start2 < start1 ? Math.min(0,start1-(start2+size2)) : Math.max(0,start1+size1-start2);
// }

module.exports = Rectangle;