
var Map = require('./map.js');
var SnowWall = require('./sprite/snow_wall.js');
var SnowMan = require('./sprite/snow_man.js');
var Constants = require('./constants.js');

/**
 * @summary The engine that runs the server side of the game.
 *
 * Long description. (use period)
 *
 * @class
 * @global {Object} Constants.
 * @param int FPS the Frames per second that the game will run.
 */
var ServerEngine = function(FPS) {
    this.FPS = 1000 / FPS;
    this.gameObjects = new Array(Constants.NUM_TYPES); // 2D array: (type,index)
    this._availableIDs = new Array(Constants.NUM_TYPES);
    for (var i = 0; i < Constants.NUM_TYPES; i++) {
        this.gameObjects[i] = [];
        this._availableIDs[i] = [];
    }
    Constants.sprites = this.gameObjects;
    Constants.engine = this;
}
    
/**
 * @summary returns a copy of all the game objects in a 2D array.
 *
 * Calls this.getCopyOfObjects() for each type array in the gameObjects of this engine.
 *
 * @return a copy of all the game objects in a 2D array.
 */
ServerEngine.prototype.getCopyOfAllObjects = function() {
    var copy = new Array(this.gameObjects.length);
    for (var i = 0; i < copy.length; i++) {
        copy[i] = this.getCopyOfObjects(i);
    }
    return copy;
}
    
/**
 * @summary returns a copy of the game objects based on the given int type.
 *
 * Calls sprite.getInfo() for each sprite in the array in the gameObjects of this engine.
 *
 * @param {number} type from Constants
 * @return if type is an index, return an array of a copy of just those type of objects, else a copy of all the game objects in a 2D array.
 */
ServerEngine.prototype.getCopyOfObjects = function(type) {
    if (type < 0) return this.getCopyOfAllObjects();// note: this check may not work properly if not int (try: !(type >= 0))
    var copy = new Array(this.gameObjects[type].length);
    for (var i = 0; i < copy.length; i++) {
        if (this.gameObjects[type][i])
            copy[i] = this.gameObjects[type][i].getInfo();
    }
    return copy;
}
 
/**
 * Generates the map with given tile width and height (not pixels)
 */ 
/**
 * @summary Generates the map with given tile width and height (not pixels).
 *
 * Sets this.world to a new Map() with the given tile width and height.
 * Also sets Constants.bounds to the new Map()
 *
 * @global class Map
 *
 * @param int width tile width of the Map.
 * @param int height tile height of the Map.
 * @return {Object} Map that was just created
 */
ServerEngine.prototype.createWorld = function(width, height) {
    this.world = new Map(0,0,width,height);
    Constants.bounds = this.world;
    return this.world;
}
 
/**
 * @summary Runs the game loop.
 *
 * Calls this.update() based on the FPS that this engine was constructed with
 */
ServerEngine.prototype.run = function() {
    var desiredTime = Date.now() + this.FPS;
 
    this.update();

    var engine = this;
 
    var interval = Math.max(0, desiredTime-Date.now());
    setTimeout( function() { engine.run() }, interval); // basic infinite loop
}

/**
 * @summary Updates the logic of the game by looping through all the game objects
 *
 * Calls the update() method for all the sprites in this.gameObjects.
 * If sprite.isDead !== false, then calls this.killSprite() for that sprite.
 * Then emits an update to all sockets with this.getCopyOfAllObjects();
 */
ServerEngine.prototype.update = function() {
    for (var type = 0; type < this.gameObjects.length; type++) {
        for (var i = 0; i < this.gameObjects[type].length; i++) {
            var s = this.gameObjects[type][i];
            if (s) {
                s.update();
                if (s.isDead !== false)
                    this.killSprite(s,type,i);
            }
        }
    }
    this.io.sockets.emit('update',this.getCopyOfAllObjects());
} 
    
/**
 * @summary Adds given sprite to one of the type arrays
 *
 * Puts the given object in the type array using an index taken from this.getNextAvailableIndex(type)
 * If obj.type === "PLAYER" then emits an announcement to all sockets that the object entered
 *
 * @param int type that determines which array to add object to (should be taken from Constants).
 * @param {Object} sprite Any object that extends the sprite class.
 */
ServerEngine.prototype.add = function(type,obj) {
    obj.index = this.getNextAvailableIndex(type);
    this.gameObjects[type][obj.index] = obj;
    if (obj.type === "PLAYER") {
        console.log("(" + obj.index + ") " + obj.text + " entered at (" + obj.x + "," + obj.y + ")");
        this.io.sockets.emit('announce', obj.text + " entered"); // broadcast to every socket
    }
}
    
/**
 * @summary Removes a sprite from the type and index
 *
 * Sets the object in the given type and index slot to null.
 * Updates available index numbers and the array based on this removal.
 * Returns the object that was removed
 *
 * @param int type determines the type array (should be taken from Constants).
 * @param int index of the object.
 * @return {Object} sprite the sprite that was removed.
 */
ServerEngine.prototype.remove = function(type,index) {
    var obj = this.gameObjects[type][index];
    this.gameObjects[type][index] = null;
    if (index != this.gameObjects[type].length - 1)
    {
        this._availableIDs[type].push(index);
        this._availableIDs[type].sort();
    }
    else
    {
        // this.gameObjects[type].pop();
        this.gameObjects[type].length--; // remove last index without too much processing
    }
    return obj;
}
    
/**
 * @summary Kills the given sprite
 *
 * Calls this.remove() with the given type and index.
 * If sprite.type === "PLAYER" then emit announcement to all sockets of the player's death
 * replace player with a snowman
 *
 * @param {Object} sprite.
 * @param int type from Constants that the sprite is located.
 * @return int index location of the sprite.
 */
ServerEngine.prototype.killSprite = function(sprite,type,index) {
    this.remove(type,index);
    if (sprite.type === "PLAYER")
    {
        var deathInfo = sprite.text + " died to " + sprite.killer;
        console.log(deathInfo);
        this.io.sockets.emit('announce', deathInfo);
        var s = new SnowMan(sprite.x,sprite.y,sprite.radius,Constants.DEFAULT_DIRFACING,Constants.DEFAULT_SNOW_MAN_TIME);
        s.startTimers();
        this.add(Constants.SNOW_MEN,s);
    }
}
    
/**
 * @summary Returns the next available index
 *
 * Returns what is in this._availableIDs updated by the this.remove() method or the next index in the gameObjects
 *
 * @param int type.
 * @return int index of next available spot.
 */
ServerEngine.prototype.getNextAvailableIndex = function(type) {
    return (this._availableIDs[type].length !== 0) ? 
            this._availableIDs[type].shift() : 
            this.gameObjects[type].length;
}
    
/**
 * @summary Returns whether or not the given tile overlaps a sprite
 *
 * Goes through all the sprites and returns the first sprite that fills the following conditions:
 *      sprite is defined
 *      sprite is collidable
 *      tile.overlaps(sprite)
 *
 * @param {Object} tile to check for overlaps.
 * @return false if there is no collision with sprites else the first sprite it collided with
 */
ServerEngine.prototype.overlapsSprites = function(tile) {
    for (var type = 0; type < this.gameObjects.length; type++) {
        for (var i = 0; i < this.gameObjects[type].length; i++) {
            var s = this.gameObjects[type][i];
            if (s && s.collidable && tile.overlaps(s))
                return s;
        }
    }
    return false;
}
    
/**
 * @summary Returns the number of sprites of a given type
 *
 * @param int type (from Constants).
 * @return the number of sprites of a given type.
 */
ServerEngine.prototype.getNumOf = function(type) {
    return this.gameObjects[type].length - this._availableIDs[type].length;
}
    
/**
 * @summary Returns the number of players.
 *
 * Adds this.getNumOf(PLAYERS) and this.getNumOf(AISPRITES).
 *
 * @return the number of players.
 */
ServerEngine.prototype.getNumPlayers = function() {// note: may be more efficient to have a counter outside
    return this.getNumOf(Constants.PLAYERS) + this.getNumOf(Constants.SPRITES);
}

module.exports.getEngine = function(FPS) {
    return new ServerEngine(FPS);
}