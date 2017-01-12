var NUM_MOUSE_BUTTONS = 3;

var UIObject = function(x,y,radius) {
    Circle.call(this,x,y,radius);
}

UIObject.prototype = Object.create(Circle.prototype);
UIObject.prototype.constructor = UIObject;

UIObject.prototype.intersects = function(mouse) {
    var distance = this.getDistance(mouse);
    return distance < this.radius;
}

UIObject.prototype.updateStats = function(mouse) {
    if (this.intersects(mouse)) {
        this.hovered = true;
        // for each mouse button type check if mousedown and set clicked true only if it is clicked
        for (var i = 0; i < NUM_MOUSE_BUTTONS; i++) {
            if (mouse.clicked[i]) {
                this.clicked[i] = true;
            }
        }
    } else {
        this.hovered = false;
    }

    // check for any mouseup and update clicked
    for (var i = 0; i < NUM_MOUSE_BUTTONS; i++) {
        if (!mouse.down[i]) {
            this.clicked[i] = false;
        } 
    }
}