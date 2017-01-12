
var UIRectangle = function(x,y,width,height) {
	Rectangle.call(this,x,y,width,height);
	this.fillStyle = "rgba(50,100,200,0.5)";
	this.textColor = "rgb(255,255,255)";
	this.fontSize = 20; // in px
	this.fontFamily = "Hanken Round";
	this.textAlign = "center";
	this.textBaseline = "top";
}

UIRectangle.prototype = Object.create(Rectangle.prototype);
UIRectangle.prototype.constructor = UIRectangle;
// UIRectangle._super = Object.getPrototypeOf(UIRectangle.prototype);

UIRectangle.prototype.update = function() {}

// UIRectangle.prototype.draw = function(canvas) {
// 	UIRectangle._super.draw.call(this,canvas);
// }

UIRectangle.prototype.resize = function(canvas) {}

