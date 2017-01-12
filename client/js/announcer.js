var defaultTime = 5000; // in milliseconds

var Announcer = function(x,y,width,height,max) {
	UIRectangle.call(this,x,y,width,height);
	this.fillStyle = "rgba(0,0,0,0)";
	this.textColor = "rgba(0,0,0,1.0)";
	this.fontSize = 30;
	this.announcements = [];
	this.max = max || 3;
}

Announcer.prototype = Object.create(UIRectangle.prototype);
Announcer.prototype.constructor = Announcer;
Announcer._super = Object.getPrototypeOf(Announcer.prototype);

Announcer.prototype.addAnnouncement = function(text,time,textColor) {
	this.announcements.push(new Announcement(this,text,time || defaultTime,textColor));
	if (this.announcements.length > this.max)
		this.announcements[0].disappear();
}

Announcer.prototype.removeAnnouncement = function(announcement) {
	var index = this.announcements.indexOf(announcement);
	if (index !== -1)
		this.announcements.remove(index);
}

Announcer.prototype.draw = function(canvas) {
	Announcer._super.draw.call(this,canvas);
	this.drawText(canvas,this.text,this.centerX(),this.topSide());
	for (var i = 0; i < this.announcements.length; i++) {
		this.announcements[i].draw(canvas,this.x,this.y + this.fontSize*i);
	}
}

// ------------------ Announcement ---------------- //
var Announcement = function(announcer,text,time,textColor) {
	this.announcer = announcer;
	this.text = text;
	this.start = new Date().getTime();
	this.time = time;
	this.textColor = textColor || this.announcer.textColor;
	var a = this;
	this.timer = setTimeout(function() { a.disappear(); }, time);
}

Announcement.prototype.disappear = function() {
	clearTimeout(this.timer);
	this.announcer.removeAnnouncement(this);
}

Announcement.prototype.draw = function(canvas,x,y) {
	var a = 1.0 - (new Date().getTime() - this.start) / this.time;
	var color = this.textColor.slice(0,this.textColor.lastIndexOf(",")+1) + a + ")";
	this.announcer.drawText(canvas,this.text,x,y,color);
}

