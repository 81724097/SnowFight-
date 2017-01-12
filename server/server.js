
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/../client'));
app.use('/client', express.static(__dirname + '/../client'));
app.use('/console', express.static(__dirname));
app.use('/server', express.static(__dirname));

app.get('/', function(request, response) {
	response.render('../client/game.html')
});

app.get('/client', function(request, response) {
	response.render('../client/game.html');
});

app.get('/console', function(request, response) {
	response.render('console.html');
});

app.get('/server', function(request, response) {
	response.render('index.html');
});


var io = require('socket.io')(app.listen(app.get('port'), function() {
  console.log('Listening on port', app.get('port'));
}));


var JS_PACKAGE = './js/';
var SPRITE_PACKAGE = JS_PACKAGE + 'sprite/';
var Constants = require(JS_PACKAGE + 'constants.js');
// var Console = require(JS_PACKAGE + 'console.js');

var engine = require(JS_PACKAGE + 'server_engine.js').getEngine(Constants.FPS);
var Player = require(SPRITE_PACKAGE + 'player.js');
var Projectile = require(SPRITE_PACKAGE + 'projectile.js');
var SnowWall = require(SPRITE_PACKAGE + 'snow_wall.js');
var SnowPile = require(SPRITE_PACKAGE + 'snow_pile.js');
var AISprite = require(SPRITE_PACKAGE + 'ai.js');

var defaultProj = new Projectile(null,50,50,Constants.TILE_RADIUS/2,Constants.DEFAULT_PROJ_VELOCITY,Constants.DEFAULT_DIRECTION,Constants.DEFAULT_PROJ_TIME);
var defaultWall = new SnowWall(50,50,Constants.TILE_RADIUS,Constants.DEFAULT_DIRECTION,Constants.DEFAULT_WALL_TIME);
var defaultPile = new SnowPile(50,50,Constants.TILE_RADIUS,Constants.DEFAULT_DIRFACING,Constants.DEFAULT_PILE_TIME);
var defaultAI = new AISprite(50,50,Constants.TILE_RADIUS,Constants.DEFAULT_VELOCITY,Constants.DEFAULT_DIRECTION,Constants.DEFAULT_REGEN_DELAY);

var Cloner = require(JS_PACKAGE + 'cloner.js').set(defaultProj,defaultAI,defaultWall,defaultPile);

engine.createWorld(Constants.WORLD_WIDTH,Constants.WORLD_HEIGHT);
engine.io = io;
Constants.io = io;
console.log("Server Loaded");

engine.run();
startSpawning();

var _log = console.log.bind(console);
console.log = function() {
    _log.apply(this, arguments);
    io.sockets.emit('console',arguments);
}

io.on('connection', function (socket) {
	console.log("Connection established with new Client");

	var player;
	// send entire game over
	socket.on('requestWorld', function() {
		socket.emit('loadWorld', { world: engine.world, gameObjects: engine.getCopyOfAllObjects() });
	});
	socket.on('name', function (data) {
		player = newPlayer(data);
		engine.add(Constants.PLAYERS,player);
		console.log("Registered " + data + " with index " + player.index);
		socket.emit('player', player.getInfo());
	});
	socket.on('input', function (data) { // needs to be changed into a better update method
		var obj = engine.gameObjects[Constants.PLAYERS][data.index];
		if (obj) {
			obj.mouse = data.mouse;
			obj.keys.copy(data.keys);
		}
	});
	socket.on('chat', function (data) {
		if (player) {
			console.log(player.text + ": " + data);
			io.sockets.emit('chat', player.text + ": " + data);
		}
	});
	socket.on('console', function (data) {
		processCommand(data);
	});
	socket.on('disconnect', function () {
		if ( player )
		{
			console.log("(" + player.index + ") " + player.text + " left");
			if (!player.isDead) {
	        	io.sockets.emit('announce', player.text + " left");
				engine.remove(Constants.PLAYERS,player.index);
			}
		}
		else console.log("Disconnect Registered");
	});
});

// ------------------------------------------ Helper Functions ------------------------------- //
var spawnTimer;
function startSpawning(time) { // time in milliseconds
	time = time || Constants.SPAWN_CYCLE;
	spawnTimer = setInterval(spawnIntervals,time);
	console.log("Spawn intervals started at " + (time/1000) + " seconds");
}

function stopSpawning() {
	clearInterval(spawnTimer);
	console.log("Spawn intervals stopped");
}

function spawnIntervals() {
	maintainPlayerNumbers();
	if (engine.getNumOf(Constants.SNOW_PILES) < Constants.PREFERED_PILE_NUMBERS) {
		var pos = getRandomPosition();
		engine.add(Constants.SNOW_PILES,Cloner.cloneSnowPile(defaultPile,pos.x,pos.y));
		pos = getRandomPosition();
		engine.add(Constants.SNOW_PILES,Cloner.cloneSnowPile(defaultPile,pos.x,pos.y));
	}
}

function maintainPlayerNumbers() {
	if (engine.getNumPlayers() < Constants.PREFERED_PLAYER_NUMBERS) {
		var pos = getRandomPosition();
		var name = Constants.getRandomName();
		engine.add(Constants.SPRITES,Cloner.cloneAISprite(defaultAI,name,pos.x,pos.y));
	}
}

// returns a new player that is already added to the engine
function newPlayer(name) {
	var pos = getRandomPosition();
	var player = new Player(pos.x,pos.y,defaultAI.radius,Constants.DEFAULT_VELOCITY,Constants.DEFAULT_DIRECTION,Constants.DEFAULT_REGEN_DELAY);
	player.copySpriteInfo(defaultAI);
	player.x = pos.x;
	player.y = pos.y;
	player.text = name;
	player.startTimers();
	return player;
}

// returns a random position that is not occupied by sprites or undefined
function getRandomPosition() {
	var openSpots = []; // inefficient (but guaranteed) method to find all available spots in the world
	var tiles = engine.world.tiles;
	for (var i = 0; i < tiles.length; i++) {
		for (var j = 0; j < tiles[i].length; j++) {
			if (!engine.overlapsSprites(tiles[i][j]))
				openSpots.push({x:Constants.toPixels(i),y:Constants.toPixels(j)});
		}
	}
	return openSpots[Constants.getRandomInt(0,openSpots.length)];
}

// -------------------------------- CONSOLE INPUT MANAGEMENT -------------------------- //
var stdin = process.openStdin(); // set up console input
var n;

function next(input,defaultInput) {
	return input[n++] || defaultInput;
}

function nextInt(input,defaultInput) {
	return parseInt(next(input)) || defaultInput;
}

function convertTypeFromString(type) {
	if (type === "player" || type === "players")
		return Constants.PLAYERS;
	if (type === "sprite" || type === "sprites")
		return Constants.SPRITES;
	if (type === "proj" || type === "projectile" || type === "projectiles")
		return Constants.PROJECTILES;
	if (type === "snow_pile" || type === "pile" || type === "snow_piles" || type === "piles")
		return Constants.SNOW_PILES;
	if (type === "snow_wall" || type === "wall" || type === "snow_walls" || type === "walls")
		return Constants.SNOW_WALLS;
	if (type === "snow_man" || type === "man" || type === "snow_men" || type === "men")
		return Constants.SNOW_MEN;
	return -1;
}

function printObjects(input,arg) {
	arg = arg || input[n];
	if (arg === "?") {
		help(input[n-1]);
	}
	else console.log(getObjects(convertTypeFromString(input[n-1]),arg));
}

function getObjects(type,arg) {
	return engine.getCopyOfObjects(type);
	// var objects = arg === "copy" ? engine.getCopyOfObjects(type) : engine.gameObjects[type];
	// return type >= 0 ? objects : engine.gameObjects;
}

function objects(input) {
	var arg = next(input);
	runHandler(OBJECT_CMDS,arg,input,function() {console.log("'" + arg + "' is not a recognized argument");});
}

function give(input) {
	var arg = next(input);
	var type = nextInt(input,Constants.PLAYERS);
	var index = nextInt(input,0);
	var amt = nextInt(input,1);
	var sprite = engine.gameObjects[type][index];
	if (arg === "snow") {
		if (give_checkSprite(sprite)) {
			sprite.snow += amt;
			console.log("Gave " + amt + " snow to " + sprite.text);
		}
	}
	else if (arg === "points") {
		if (give_checkSprite(sprite)) {
			sprite.points += amt;
			console.log("Gave " + amt + " points to " + sprite.text);
		}
	}
	else if (arg === "health") {
		if (give_checkSprite(sprite)) {
			sprite.hp += amt;
			console.log("Gave " + amt + " health to " + sprite.text);
		}
	}
	else if (arg === "?") {
		help(input[0]);
	}
	else console.log("'" + arg + "' is not a recognized argument");
}
function give_checkSprite(sprite) {
	if (!sprite){
		console.log("There is no sprite at (" + type + "," + index + ")");
		return false;
	}
	return true;
}

function spawn(input) {
	var arg = next(input);
	if (arg === "world") {
		var w = nextInt(input,Constants.WORLD_WIDTH);
		var h = nextInt(input,Constants.WORLD_HEIGHT);
		engine.createWorld(w,h);
		console.log("Recreated world with tile dimensions: (" + w + "," + h + ")");
	}
	else if (arg === "projectile") { // testing projectiles
		var x = nextInt(input);
		var y = nextInt(input);
		var radius = nextInt(input);
		var velocity = nextInt(input);
		var dir = nextInt(input);
		var time = nextInt(input);
		var proj = Cloner.cloneProjectile(defaultProj,x,y,radius,velocity,dir,time);
		engine.add(Constants.PROJECTILES,proj);
		console.log("Created Projectile at (" + proj.x + "," + proj.y + "); size: " + proj.radius + "; (" + proj.velocity + "," + proj.dir + "*), lasting " + proj.time + " milliseconds");
	}
	else if (arg === "ai") { // testing ai
		var pos = getRandomPosition();
		var name = next(input,Constants.getRandomName());
		var x = nextInt(input,pos.x);
		var y = nextInt(input,pos.y);
		var radius = nextInt(input);
		var vel = nextInt(input);
		var dir = nextInt(input);
		var time = nextInt(input);

		var maxHp = nextInt(input);
		var hp = nextInt(input);
		var atk = nextInt(input);

		var ai = Cloner.cloneAISprite(defaultAI,name,x,y,radius,vel,dir,time,maxHp,hp,atk);
		engine.add(Constants.SPRITES,ai);
		console.log("Created '" + ai.text + "' AISprite at (" + ai.x + "," + ai.y + "); size: " + ai.radius + "; (" + ai.velocity + "," + ai.dir + "*), lasting " + ai.time + " milliseconds\n" +
					"      Starting with " + ai.hp + "/" + ai.maxHp + " hp, " + ai.atk + " atk");
	}
	else if (arg === "wall") { // testing ai
		var pos = getRandomPosition();
		var x = nextInt(input,pos.x);
		var y = nextInt(input,pos.y);
		var radius = nextInt(input);
		var dir = nextInt(input);
		var time = nextInt(input);
		var wall = Cloner.cloneSnowWall(defaultWall,x,y,radius,dir,time);
		engine.add(Constants.SNOW_WALLS,wall);
		console.log("Created Snow Wall at (" + wall.x + "," + wall.y + "); size: " + wall.radius + "; (" + wall.velocity + "," + wall.dir + "*), lasting " + wall.time + " milliseconds");
	}
	else if (arg === "pile") { // testing ai
		var pos = getRandomPosition();
		var x = nextInt(input,pos.x);
		var y = nextInt(input,pos.y);
		var radius = nextInt(input);
		var dir = nextInt(input);
		var time = nextInt(input);
		var pile = Cloner.cloneSnowPile(defaultPile,x,y,radius,dir,time);
		engine.add(Constants.SNOW_PILES,pile);
		console.log("Created Snow Pile at (" + pile.x + "," + pile.y + "); size: " + pile.radius + "; (" + pile.velocity + "," + pile.dir + "*), lasting " + pile.time + " milliseconds");
	}
	else help(input[0]);
}

function random(input) {
	var arg = next(input);
	var min = nextInt(input,0);
	var max = nextInt(input,100);
	if (arg === "arbitrary") {
		console.log("Rolled from [" + min + "-" + max + "): " + Constants.getRandomArbitrary(min,max));
	}
	else if (arg === "int" || arg === "integer") {
		console.log("Rolled from [" + min + "-" + max + "): " + Constants.getRandomInt(min,max));
	}
	else help(input[0]);
}

function start(input) {
	var arg = next(input);
	if (arg === "spawning") {
		var time = nextInt(input);
		startSpawning(time);
	}
	else help(input[0]);
}

function stop(input) {
	var arg = next(input);
	if (arg === "spawning") {
		stopSpawning();
	}
	else help(input[0]);
}

function exit() {
	console.log("Closing server...Good-bye");
	process.exit();
}

var COMMANDS = [ { name: "objects", handler: objects },
				 { name: "give",  handler: give },
				 { name: "new",   handler: spawn },
				 { name: "spawn", handler: spawn },
				 { name: "random", handler: random },
				 { name: "roll",   handler: random },
				 { name: "start", handler: start },
				 { name: "stop",  handler: stop },
				 { name: "",  handler: cmdlets },
				 { name: "?", handler: cmdlets },
				 { name: "exit", handler: exit },
				 { name: "quit", handler: exit } ];

var OBJECT_CMDS = [ { name: "players", handler: printObjects },
					{ name: "sprites", handler: printObjects },
					{ name: "projectiles", handler: printObjects },
					{ name: "proj", handler: printObjects },
					{ name: "snow_piles", handler: printObjects },
					{ name: "piles", handler: printObjects },
					{ name: "snow_walls", handler: printObjects },
					{ name: "walls", handler: printObjects },
					{ name: "snow_men", handler: printObjects },
					{ name: "men", handler: printObjects },
					{ name: "all", handler: printObjects },
					{ name: "copy", handler: printObjects },
					{ name: "?", handler: printObjects },
					{ name: "", handler: printObjects } ];
COMMANDS = COMMANDS.concat(OBJECT_CMDS);
var HELP_INFO = [ { name: "players",    handler: object_cmds },
				  { name: "sprites",    handler: object_cmds },
				  { name: "projectiles",handler: object_cmds },
				  { name: "proj",       handler: object_cmds },
				  { name: "snow_piles", handler: object_cmds },
				  { name: "piles",      handler: object_cmds },
				  { name: "snow_walls", handler: object_cmds },
				  { name: "walls",      handler: object_cmds },
				  { name: "snow_men",   handler: object_cmds },
				  { name: "men",        handler: object_cmds },
				  { name: "objects",    handler: object_cmds },
				  { name: "give", handler: give_cmds },
				  { name: "new",   handler: spawn_cmds },
				  { name: "spawn", handler: spawn_cmds },
				  { name: "random", handler: random_cmds },
				  { name: "roll",   handler: random_cmds },
				  { name: "start", handler: start_cmds },
				  { name: "stop",  handler: start_cmds },
				  { name: "",  handler: cmdlets },
				  { name: "?", handler: cmdlets },
				 //  { name: "exit", handler:  },
				 //  { name: "quit", handler:  } 
					];

function help(cmd) {
	runHandler(HELP_INFO,cmd,cmd,cmdlets);
}

function object_cmds(cmd) {
	console.log("The '" + cmd + "' command accepts the following arguments: ");
	console.log("    'copy' (displays minimal info) "                        );
	if (cmd !== "objects") return;
	console.log("    'players'"                                              );
	console.log("    'sprites'"                                              );
	console.log("    'projectiles' or 'proj'"                                );
	console.log("    'snow_piles' or 'piles'"                                );
	console.log("    'snow_walls' or 'walls'"                                );
	console.log("    'snow_men' or 'men'"                                    );
}

function give_cmds(cmd) {
	console.log("The '" + cmd + "' command accepts the following arguments: ");
	console.log("    'snow' followed by: "                                   );
	console.log("        int type (0 = player, 1 = ai)"                      );
	console.log("        int index"                                          );
	console.log("        int amount"                                         );
	console.log("    'points' followed by: "                                 );
	console.log("        int type (0 = player, 1 = ai)"                      );
	console.log("        int index"                                          );
	console.log("        int amount"                                         ); 
}

function spawn_cmds(cmd) {
	console.log("The '" + cmd + "' command accepts the following arguments: ");
	console.log("    'world' followed by: "                                  );
	console.log("        int width (in tile dimensions)"                     );
	console.log("        int height (in tile dimensions)"                    );
	console.log("    'projectile' followed by: "                             );
	console.log("        int x (position)"                                   );
	console.log("        int y (position)"                                   );
	console.log("        int radius"                                         );
	console.log("        int velocity"                                       );
	console.log("        int direction (in degrees)"                         );
	console.log("        int time (in milliseconds)"                         );
	console.log("    'ai' followed by: "                                     );
	console.log("        int name"                                           );
	console.log("        int x (position)"                                   );
	console.log("        int y (position)"                                   );
	console.log("        int radius"                                         );
	console.log("        int velocity"                                       );
	console.log("        int direction (in degrees where -1 is stop)"        );
	console.log("        int maxHp"                                          );
	console.log("        int hp"                                             );
	console.log("        int atk"                                            );
	console.log("    'wall' followed by: "                                   );
	console.log("        int x (position)"                                   );
	console.log("        int y (position)"                                   );
	console.log("        int radius"                                         );
	console.log("        int direction (in degrees where -1 is stop)"        );
	console.log("        int time (in milliseconds)"                         );
	console.log("    'pile' followed by: "                                   );
	console.log("        int x (position)"                                   );
	console.log("        int y (position)"                                   );
	console.log("        int radius"                                         );
	console.log("        int direction (in degrees where -1 is stop)"        );
	console.log("        int time (in milliseconds)"                         );
}

function random_cmds(cmd) {
	console.log("The '" + cmd + "' command accepts the following arguments: ");
	console.log("    'arbitrary' followed by: "                              );
	console.log("        int min (inclusive)"                                );
	console.log("        int max (exclusive)"                                );
	console.log("    'integer' followed by: "                                );
	console.log("        int min (inclusive)"                                );
	console.log("        int max (exclusive)"                                );
}

function start_cmds(cmd) {
	console.log("The '" + cmd + "' command accepts the following arguments: ");
	console.log("    'spawning' followed by: "                               );
	console.log("        int time (interval in milliseconds)"                );
}

function stop_cmds(cmd) {
	console.log("The '" + cmd + "' command accepts the following arguments: ");
	console.log("    'spawning' followed by: "                               );
	console.log("        int time (delay in milliseconds)*"                  );
}

function cmdlets() {
	console.log("The commands available are the following: ");
	console.log("    'exit' or 'quit'"                      );
	console.log("    'new' or 'spawn'"                      );
	console.log("    'random' or 'roll'"                    );
	console.log("    'give'"                                );
	console.log("    'start'"                               );
	console.log("    'stop'"                                );
	console.log("    'objects'"                             );
	console.log("    'players'"                             );
	console.log("    'sprites'"                             );
	console.log("    'projectiles' or 'proj'"               );
	console.log("    'snow-walls' or 'walls'"               );
	console.log("    'snow-piles' or 'piles'"               );
	console.log("    'snow-men' or 'men'"                   );
	console.log("Note: anything '*' is not supported"       );
}

function runHandler(list,cmd,arg,closer) {
    for (var i = 0; i < list.length; i++) {
        if (cmd === list[i].name) {
            list[i].handler(arg);
            return;
        }
    }
    closer();
}

stdin.addListener('data', processCommand);

function processCommand(data) {
	// retrieve console input as an array that divides by whitespace
	var input = data.toString().trim().toLowerCase().split(/\s/);
	n = 0;
	var cmd = next(input,"");
	runHandler(COMMANDS,cmd,input,function() {console.log("'" + cmd + "' is not a command");});
}




