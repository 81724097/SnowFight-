
var Constants = {
	FPS: 30,
	WORLD_WIDTH: 40, // in tiles
	WORLD_HEIGHT: 40,  // in tiles
	TILE_SIZE: 64,
	PREFERED_PLAYER_NUMBERS: 6,
	PREFERED_PILE_NUMBERS: 20,
	SPAWN_CYCLE: 5000, // in milliseconds

	DEFAULT_STARTING_SNOW: 10, // Amount of snow players start with
	DEFAULT_VELOCITY: 8, // default speed for all players
	DEFAULT_DIRECTION: -1, // starting default direction in degrees where -1 is stop/no direction
	DEFAULT_DIRFACING: 90, // starting default direction sprites face (for animation)
	DEFAULT_ATK: 2, // amount of damage dealt per hit
	DEFAULT_MAXHP: 10, // max hp for all players
	DEFAULT_REGEN_DELAY: 5000, // delay before players gain hp
	DEFAULT_SHOOT_DELAY: 1000, // time delay before players can shoot again
	DEFAULT_PLACE_WALL_DELAY: 1000, // time delay before players can place walls again
	DEFAULT_PICK_SNOW_DELAY: 1000, // time delay before players can pick snow again
	DEFAULT_MAX_SNOW: 10, // time delay before players can pick snow again

	DEFAULT_PROJ_COST: 1, // Amount of snow that each projectile costs
	DEFAULT_PROJ_TIME: 3000, // time projectiles last (in milliseconds)
	DEFAULT_PROJ_VELOCITY: 16, // default speed for all projectiles

	DEFAULT_WALL_COST: 2, // Amount of snow that each wall costs
	DEFAULT_WALL_TIME: 10000, // time interval in which walls shrink (in milliseconds)
	DEFAULT_WALL_SIZE: 4, // max size for the snow walls
	DEFAULT_WALL_STARTING_HP: 1, // also determines the increment amount for walls when adding snow

	DEFAULT_PILE_TIME: 10000, // time interval in which piles shrink (in milliseconds)
	DEFAULT_PILE_SIZE: 4, // max size for the snow piles
	DEFAULT_PILE_SNOW: 3, // amt of snow per grab from the snow piles

	DEFAULT_SNOW_MAN_RANGE: 5, // how close the players must be in order to pick snow off of a snowman
	DEFAULT_SNOW_MAN_TIME: 10000, // time interval in which walls shrink (in milliseconds)


	DEFAULT_NAMES: ["asdf","qwerty","zxcv","hjkl","yuio","vbnm","AI",
					"Back Breaker","Bare Bones","Big Bucks","Blood Brother",
					"Cash Crop", "Class Clown","Crew Cut", "Crystal Clear",
					"Dare Devil", "Day Dream", "Do or Die", "Double Dare",
					"Fear Factor", "Forgive and Forget", "Frequent Flier",
					"Gentle Giant", "Go Getter", "Hard Headed", "Heavy Hitter",
					"Jumbo Jet", "Last Laugh", "Law of the Land", "Love Letter",
					"Mere Mortals", "Motor Mouth", "Mountain Mover", "Party Pooper",
					"Pay to Play", "Peer Pressure", "Pen Pal", "Persistence Pays",
					"Pet Peeve", "Picture Perfect", "Pitter Patter", "Pretty Penny",
					"Rabble Rouser", "Rags to Riches", "Rant and Rave", "Rave Reviews",
					"Road Rage", "Rough Rider", "Round Robin", "Sad Sack", "Secret Sauce",
					"Shell Shocked", "Ship Shape", "Silver Screen", "Slippery Slope",
					"Smooth Sailing", "Snow Screen", "Sorry Sight", "Spending Spree",
					"Spoil Sport", "Star Struck", "Surgical Strike", "Swan Song",
					"Sweat Shop", "Sweet Spot", "Taste Test", "Tea Time", "Temper Tantrum", 
					"Luxury Lap", "Think Tank", "Tip Toe", "Tongue Tied", "Tough Time", 
					"Treasure Trove", "Trick or Treat", "Table Turner", "Veal Vibe", 
					"Vice Versa", "Vigor Vim", "Walking Wounded", "Wet Weasel", 
					"Wet Whistle", "Whole Hearted", "Wild West", "Wishy Washy", 
					"Wise Words", "Worry Wart", "Yin Yang", "Zig Zag"],
	// array indices 
	SNOW_PILES: 0,
	PLAYERS: 1,
	SPRITES: 2,
	SNOW_MEN: 3,
	SNOW_WALLS: 4,
	PROJECTILES: 5,
	NUM_TYPES: 6,

	toPixels: function(tiles) {
		return tiles*Constants.TILE_SIZE + Constants.TILE_RADIUS;
	},
	toTiles: function(pixels) {
		return (pixels - Constants.TILE_RADIUS)/Constants.TILE_SIZE;
	},
	toRadians: function(degree) {
	    return degree * (Math.PI / 180);
	},
	toDegrees: function(radians) {
	    return radians * (180 / Math.PI);
	},
	/** Returns a random number between min (inclusive) and max (exclusive) */
	getRandomArbitrary: function(min, max) {
	    return Math.random() * (max - min) + min;
	},
	/** Returns a random integer between min (inclusive) and max (exclusive) */
	getRandomInt: function(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	},
	getRandomName: function() {
		return Constants.DEFAULT_NAMES[Constants.getRandomInt(0,Constants.DEFAULT_NAMES.length)];
	},
	getDistance: function(x1,y1,x2,y2) {
	    return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
	},
	getAngle: function(x1,y1,x2,y2) {
	    return Constants.toDegrees( Math.atan2(y2 - y1, x2 - x1) );
	}
};

Constants.TILE_RADIUS = Constants.TILE_SIZE/2;

module.exports = Constants;

/**
 * @summary Short description. (use period)
 *
 * Long. (use period)
 *
 * @since x.x.x
 * @deprecated x.x.x Use new_function_name() instead.
 * @access private
 *
 * @class
 * @augments superclass
 * @mixes mixin
 *
 * @see Function/class relied on
 * @link URL
 * @global type $varname Short description.
 * @fires target:event
 * @listens target:event
 *
 * @param type $var Description.
 * @param type $var Optional. Description.
 * @return type Description.
 */