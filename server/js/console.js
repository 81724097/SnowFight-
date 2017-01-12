
var Constants = require('./constants.js')

var Console = function(commands,closer) {
	this.commands = commands || [];
	this.closer = closer || function() {};
}

// Console.prototype.addCommand = function(name,funct) {
// 	this.commands.push({name:name, handler: funct});
// }

// Console.prototype.processCommands = function(command,args) {
//     for (var i = 0; i < this.commands.length; i++) {
//         if (command === this.commands[i].name) {
//             this.commands[i].handler(args);
//             return;
//         }
//     }
//     this.closer();
// }
Console.runHandler = function(list,cmd,arg,closer) {
    for (var i = 0; i < list.length; i++) {
        if (cmd === list[i].name) {
            list[i].handler(arg);
            return;
        }
    }
    closer();
}
var n;

function next(input,defaultInput) {
	return input[n++] || defaultInput;
}

function nextInt(input,defaultInput) {
	return parseInt(next(input)) || defaultInput;
}

Console.checkCommands = function(input,closer) {
	n = 0;
	var cmd = next(input,"");
	Console.runHandler(Console.COMMANDS,cmd,input,closer);
}

Console.COMMANDS = [ { name: "players",
				   handler: function(args) { printObjects(Constants.PLAYERS); } },
				 { name: "sprites",
				   handler: function(args) { printObjects(Constants.SPRITES); } },
				 { name: "projectiles",
				   handler: function(args) { printObjects(Constants.PROJECTILES); } },
				 { name: "proj",
				   handler: function(args) { printObjects(Constants.PROJECTILES); } },
				 { name: "snow_piles",
				   handler: function(args) { printObjects(Constants.SNOW_PILES); } },
				 { name: "piles",
				   handler: function(args) { printObjects(Constants.SNOW_PILES); } },
				 { name: "snow_walls",
				   handler: function(args) { printObjects(Constants.SNOW_WALLS); } },
				 { name: "walls",
				   handler: function(args) { printObjects(Constants.SNOW_WALLS); } },
				 { name: "snow_men",
				   handler: function(args) { printObjects(Constants.SNOW_MEN); } },
				 { name: "men",
				   handler: function(args) { printObjects(Constants.SNOW_MEN); } },
				 { name: "objects",
				   handler: function(args) { 
							var arg = next(input);
							if (arg === "players") {
								printObjects(Constants.PLAYERS);
							}
							else if (arg === "sprites") {
								printObjects(Constants.SPRITES);
							}
							else if (arg === "proj" || arg === "projectiles") {
								printObjects(Constants.PROJECTILES);
							}
							else if (arg === "snow-piles" || arg === "piles") {
								printObjects(Constants.SNOW_PILES);
							}
							else if (arg === "snow-walls" || arg === "walls") {
								printObjects(Constants.SNOW_WALLS);
							}
							else if (arg === "snow-men" || arg === "men") {
								printObjects(Constants.SNOW_MEN);
							}
							else printObjects("", arg); 
						} },
				 { name: "give",
				   handler: give },
				 { name: "new",
				   handler: spawn },
				 { name: "spawn",
				   handler: spawn },
				 { name: "random",
				   handler: random },
				 { name: "roll",
				   handler: random },
				 { name: "",
				   handler: cmdlets },
				 { name: "?",
				   handler: cmdlets },
				 { name: "exit",
				   handler: exit },
				 { name: "quit",
				   handler: exit } ];


function printObjects(type,arg) {
	arg = arg || next(input);
	var objects = arg === "copy" ? engine.getCopyOfObjects(type) : engine.gameObjects[type];
	console.log(type ? objects : engine.gameObjects);
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

		var proj = defaultProj.createCopy(); //new Projectile(proj,x,y,rad,vel,dir,time);
		proj.x = nextInt(input,defaultProj.x);
		proj.y = nextInt(input,defaultProj.y);
		proj.rad = nextInt(input,defaultProj.radius);
		proj.vel = nextInt(input,defaultProj.velocity);
		proj.dir = nextInt(input,defaultProj.dir);
		proj.time = nextInt(input,defaultProj.time);
		proj.startTimers();
		engine.add(Constants.PROJECTILES,proj);
		console.log("Created Projectile at (" + proj.x + "," + proj.y + "); size: " + proj.rad + "; (" + proj.vel + "," + proj.dir + "*), lasting " + proj.time + " milliseconds");
	}
	else if (arg === "ai") { // testing ai
		var pos = getRandomPosition();
		var name = next(input, Constants.getRandomName());
		var x = nextInt(input,pos.x);
		var y = nextInt(input,pos.y);
		var rad = nextInt(input,defaultAI.radius);
		var vel = nextInt(input,defaultAI.velocity);
		var dir = nextInt(input,defaultAI.dir);

		var maxHp = nextInt(input,defaultAI.maxHp);
		var hp = nextInt(input,maxHp);
		var atk = nextInt(input,defaultAI.atk);

		var ai = new AISprite(x,y,rad,vel,dir,maxHp,atk);
		ai.text = name;
		ai.hp = hp;
		ai.projectile = defaultProj;
		ai.wall = defaultWall;
		engine.add(Constants.SPRITES,ai);
		console.log("Created '" + name + "' AISprite at (" + x + "," + y + "); size: " + rad + "; (" + vel + "," + dir + "*)\n" +
					"      Starting with " + hp + "/" + maxHp + " hp, " + atk + " atk");
	}
	else if (arg === "wall") { // testing ai
		var pos = getRandomPosition();

		var wall = defaultWall.createCopy();
		wall.x = nextInt(input,pos.x);
		wall.y = nextInt(input,pos.y);
		wall.rad = nextInt(input,defaultWall.radius);
		wall.dir = nextInt(input,defaultWall.dir);
		wall.time = nextInt(input,defaultWall.time);
		wall.startTimers();
		engine.add(Constants.SNOW_WALLS,wall);
		console.log("Created Snow Wall at (" + wall.x + "," + wall.y + "); size: " + wall.rad + "; (" + wall.velocity + "," + wall.dir + "*), lasting " + wall.time + " milliseconds");
	}
	else if (arg === "pile") { // testing ai
		var pos = getRandomPosition();

		var pile = defaultPile.createCopy();
		pile.x = nextInt(input,pos.x);
		pile.y = nextInt(input,pos.y);
		pile.rad = nextInt(input,defaultPile.radius);
		pile.dir = nextInt(input,defaultPile.dir);
		pile.time = nextInt(input,defaultPile.time);
		engine.add(Constants.SNOW_PILES,pile);
		console.log("Created Snow Pile at (" + pile.x + "," + pile.y + "); size: " + pile.rad + "; (" + pile.velocity + "," + pile.dir + "*), lasting " + pile.time + " milliseconds");
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

function give(input) {
	var arg = next(input);
	var type = nextInt(input,0);
	var index = nextInt(input,0);
	var amt = nextInt(input,1);
	var sprite = engine.gameObjects[type][index];
	if (arg === "snow") {
		sprite.snow += amt;
		console.log("Gave " + amt + " snow to " + sprite.text);
	}
	else if (arg === "points") {
		sprite.points += amt;
		console.log("Gave " + amt + " points to " + sprite.text);
	}
	else help(input[0]); 
}

function exit() {
	console.log("Closing server...Good-bye");
	process.exit();
}

// --------------------------------------- HELP ------------------------------ //
var HELP_INFO = [ 
				 //  { name: "players",
					// handler:  },
				 //  { name: "sprites",
					// handler:  },
				 //  { name: "projectiles",
					// handler:  },
				 //  { name: "proj",
					// handler:  },
				 //  { name: "snow_piles",
					// handler:  },
				 //  { name: "piles",
					// handler:  },
				 //  { name: "snow_walls",
					// handler:  },
				 //  { name: "walls",
					// handler:  },
				 //  { name: "snow_men",
					// handler:  },
				 //  { name: "men",
					// handler:  },
				  { name: "new",
					handler: spawn_cmds },
				  { name: "spawn",
					handler: spawn_cmds },
				  { name: "random",
					handler: random_cmds },
				  { name: "roll",
					handler: random_cmds },
				  { name: "give",
					handler: give_cmds },
				  { name: "",
					handler: cmdlets },
				  { name: "?",
					handler: cmdlets },
				 //  { name: "exit",
					// handler:  },
				 //  { name: "quit",
					// handler:  } 
					];

Console.help = function(cmd) {
	runHandler(HELP_INFO,cmd,cmd,cmdlets);
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

function cmdlets() {
	console.log("The commands available are the following: ");
	console.log("    'exit' or 'quit'"                      );
	console.log("    'new' or 'spawn'"                      );
	console.log("    'objects'"                             );
	console.log("    'players'"                             );
	console.log("    'sprites'"                             );
	console.log("    'projectiles' or 'proj'"               );
	console.log("    'snow-walls' or 'walls'"               );
	console.log("    'snow-piles' or 'piles'"               );
	console.log("    'snow-men' or 'men'"                   );
	console.log("    'random' or 'roll'"                    );
}
module.exports = Console;