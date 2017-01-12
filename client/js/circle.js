
var Circle = function(x, y, radius) {
    this.set(x, y, radius);
}

Circle.prototype.set = function(x, y, radius) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || this.radius || 0;
}

// returns x coordinate or where the left side of this rectangle is
Circle.prototype.leftSide = function() {
    return this.x - this.radius;
}

// returns y coordinate or where the top side of this rectangle is
Circle.prototype.topSide = function() {
    return this.y - this.radius;
}

// returns (x + width) coordinate or where the right side of this rectangle is
Circle.prototype.rightSide = function() {
    return this.x + this.radius;
}

// returns (y + height) coordinate or where the bottom side of this rectangle is
Circle.prototype.bottomSide = function() {
    return this.y + this.radius;
}

// returns 0 if this is within the given rectangle, else the closest x or y difference that would put this in the given rectangle
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
    return { dx: -dx, dy: -dy };
}


// returns whether or not this Circle overlaps the given Circle r
Circle.prototype.overlaps = function(c) {
    return Math.max(this.radius + c.radius - this.getDistance(c), 0);
}

Circle.prototype.outside = function(r) {
    return !this.overlaps(r);
}

// should change to image support though this class should not be managing drawing at all
Circle.prototype.draw = function(canvas) {
    Circle.fill(canvas,this,this.fillStyle);
    if ( this.strokeStyle )
    {
        Circle.stroke(canvas,this,this.strokeStyle,this.strokeWidth);
    }
}

Circle.prototype.getDistance = function(c)
{
    return getDistance(this.x,this.y,c.x,c.y);
}

Circle.prototype.getAngle = function(c)
{
    return getAngle(this.x,this.y,c.x,c.y);
}

Circle.fill = function(canvas,circle,style)
{
    if ( style ) canvas.fillStyle = style;
    canvas.beginPath();
    canvas.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    canvas.fill();
}

Circle.stroke = function(canvas,circle,style,width)
{
    if ( style ) canvas.strokeStyle = style;
    if ( width ) canvas.lineWidth = width;
    canvas.beginPath();
    canvas.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    canvas.stroke();
}

function getDistance(x1,y1,x2,y2)
{
    return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
}

function getAngle(x1,y1,x2,y2)
{
    return toDegrees( Math.atan2(y2 - y1, x2 - x1) ) + 180;
}
