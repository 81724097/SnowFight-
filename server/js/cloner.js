	
/**
 * @summary Clones sprites
 *
 * Call Cloner.set() to set the default sprites to clone
 */
var Cloner = {
	set: function(proj,ai,wall,pile) {
		Cloner.projectile = proj;
        Cloner.ai = ai;
        Cloner.wall = wall;
        Cloner.pile = pile;
        return Cloner;
	},
	cloneProjectile: function(proj,x,y,radius,velocity,dir,time) {
		return Cloner.cloneTimedSprite(proj||Cloner.projectile,x,y,radius,velocity,dir,time);
	},
	cloneAISprite: function(ai,name,x,y,radius,velocity,dir,time,maxHp,hp,atk,proj,wall) {
		ai = Cloner.cloneTimedSprite(ai||Cloner.ai,x,y,radius,velocity,dir,time);
		ai.text = name || ai.text;

		ai.maxHp = maxHp || ai.maxHp;
		ai.hp = hp || ai.maxHp;
		ai.atk = atk || ai.atk;
		return ai;
	},
	cloneSnowWall: function(wall,x,y,radius,dir,time) {
		return Cloner.cloneTimedSprite(wall||Cloner.wall,x,y,radius,null,dir,time);
	},
	cloneSnowPile: function(pile,x,y,radius,dir,time) {
		return Cloner.cloneTimedSprite(pile||Cloner.pile,x,y,radius,null,dir,time);
	},
	cloneTimedSprite: function(sprite,x,y,radius,velocity,dir,time) {
		sprite = Cloner.createModifiedClone(sprite,x,y,radius,velocity,dir,time);
		sprite.startTimers();
		return sprite;
	},
	createModifiedClone: function(sprite,x,y,radius,velocity,dir,time) {
		var s = sprite.createCopy();
		s.x = x || s.x;
		s.y = y || s.y;
		s.radius = radius || s.radius;
		s.velocity = velocity || s.velocity;
		s.dir = dir || s.dir;
		s.time = time || s.time;
		return s;
	}
}

module.exports = Cloner;