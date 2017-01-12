
/**
 * Constructs a basic game engine
 */
var GameEngine = function(canvas, FPS) {
    this.FPS = 1000 / FPS;
    this.canvas = canvas;
    this.context2D = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.cam = { x: 0, y: 0 };
    this.uiObjects = [];
    this.gameObjects = [];
}

GameEngine.prototype.setUIObjects = function(canvas) {
    var engine = this;
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    // announcer
    var announceX = canvasW / 2;
    var announceY = 0;
    var announceW = canvasW;
    var announceH = canvasH;
    var announceMax = 3;
    this.announcer = new Announcer(announceX,announceY,announceW,announceH,announceMax);
    engine.uiObjects.push(this.announcer);

    // leaderboard
    var offset = 10;
    var leaderW = canvasW / 6 - offset*2;
    var leaderH = 250;
    var leaderX = canvasW - leaderW - offset;
    var leaderY = offset;
    this.leaderboard = new Leaderboard(leaderX,leaderY,leaderW,leaderH);
    engine.uiObjects.push(this.leaderboard);

    // miniMap
    this.miniMap = new MiniMap(this.canvas);
    engine.uiObjects.push(this.miniMap);

    // announcer
    this.chat = new ChatBox(this.canvas);
    engine.uiObjects.push(this.chat);

    // controls display
    this.controlDisplay = new ControlsDisplay(this.context2D);

    // startScreen
    var screenW = canvasW / 3;
    var screenH = canvasH / 2;
    var screenX = (canvasW - screenW)/2;
    var screenY = (canvasH - screenH)/2;
    this.startScreen = new StartScreen(this.canvas,screenX,screenY,screenW,screenH,this.controlDisplay);
    engine.uiObjects.push(this.startScreen);

    // gameOverScreen
    screenH = canvasH * 3 / 4;
    this.gameOverScreen = new GameOverScreen(this.canvas,screenX,screenY,screenW,screenH);
    engine.uiObjects.push(this.gameOverScreen);

    // draw text
    var pointText = newTextSprite(0,0,function() {
        return "Points: " + (engine.player?engine.player.points:0);
    });
    engine.uiObjects.push(pointText);

    var snowText = newTextSprite(0,pointText.fontSize,function() {
        return "Snow: " + (engine.player?engine.player.snow + (engine.player.maxSnow ? "/"+engine.player.maxSnow : ""):0);
    });
    engine.uiObjects.push(snowText);
}

GameEngine.prototype.setWorld = function(map) {
    this.world = new Map(map);
    this.miniMap.setMap(this.world);
    return this.world;
}

GameEngine.prototype.setGameObjects = function(objects) {
    this.gameObjects = [];
    for (var type = 0; type < NUM_TYPES; type++) {
        this.gameObjects[type] = [];
        if (objects[type]) {
            for (var i = 0; i < objects[type].length; i++) {
                if (objects[type][i])
                    this.add(type,i,objects[type][i]);
            }
        }
    }
}

GameEngine.prototype.updateGameObjects = function(objects) {
    if (this.startScreen && this.player && this.player.isDead) {
        this.gameOverScreen.show();
        this.player = null;
    }
    for (var type = 0; type < this.gameObjects.length; type++) {
        if (objects[type]) {
            var length = Math.max(objects[type].length,this.gameObjects[type].length);
            for (var i = 0; i < length; i++) {
                if ((!objects[type][i] || objects[type][i].type === "FAKE")) {
                    this.remove(type,i);
                }
                else if (this.gameObjects[type][i] && this.gameObjects[type][i].type !== "FAKE") {
                    this.gameObjects[type][i].copySpriteInfo(objects[type][i]);
                }
                else {
                    this.add(type,i,objects[type][i]);
                }
            }
        }
    }
}
GameEngine.prototype.setImages = function(obj) {
    if (obj.type === "PROJECTILE") {
        obj.images = SNOW_BALL_IMAGES;
        obj.imageIndex = 0;
    }
    else if (obj.type === "SNOW_WALL") {
        obj.images = SNOW_WALL_IMAGES;
        obj.imageIndex = 0;
    }
    else if (obj.type === "SNOW_PILE") {
        obj.image = SNOW_PILE_IMAGES;
    }
    else if (obj.type === "SNOW_MAN") {
        obj.image = SNOW_MAN_IMAGES;
    }
    else if (obj.type === "PLAYER") {
        obj.images = ORANGE_SPRITE_IMAGES;
        obj.imageIndex = 0;
    }
}

GameEngine.prototype.add = function(type,index,obj) {
    this.gameObjects[type][index] = Sprite.copy(obj);
    this.setImages(this.gameObjects[type][index]);
    if (obj.type === "PLAYER" && this.gameObjects[type][index].type !== "FAKE")
        this.leaderboard.addPointHolder(this.gameObjects[type][index]);
}

GameEngine.prototype.remove = function(type,index) {
    var obj = this.gameObjects[type][index];
    this.gameObjects[type][index] = null;
    if (index == this.gameObjects[type].length - 1) {
        // this.gameObjects[type].pop();
        this.gameObjects[type].length--; // remove last index without too much processing
    }
    if (obj && obj.type === "PLAYER") {
        if (obj === this.player)
            this.chat.hide();
        this.leaderboard.removePointHolder(obj);
    }
    return obj;
}
 
/**
 * Sets up the game engine with event listeners for the given canvas
 */
GameEngine.prototype.setupInput = function() {
    this.mouse = {
        x: 0,
        y: 0,
        clicked: [false, false, false],
        down: [false, false, false]
    };
 
    var engine = this;
 
    this.canvas.addEventListener("mousemove", function(e) {
        var pos = getMousePos(engine.canvas,e);
        engine.mouse.x = pos.x;
        engine.mouse.y = pos.y;
        engine.sendUpdate(); // may not be necessary based on what is needed
    });
 
    this.canvas.addEventListener("mousedown", function(e) {
        engine.mouse.clicked[e.which-1] = !engine.mouse.down[e.which-1];
        engine.mouse.down[e.which-1] = true;
        engine.sendUpdate();
    });
 
    this.canvas.addEventListener("mouseup", function(e) {
        engine.mouse.down[e.which-1] = false;
        engine.mouse.clicked[e.which-1] = false;
        engine.sendUpdate();
    });

    document.addEventListener('keyup', function(e) { 
        if (engine.chat.hidden) {
            Keys.onKeyup(e); 
            engine.sendUpdate(); 
        }
        if (engine.player && e.keyCode === Keys.ENTER && !e.cancel) {
            engine.chat.show();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (engine.chat.hidden) {
            Keys.onKeydown(e); 
            engine.sendUpdate();
        }
    });
    window.addEventListener('resize', function() {engine.resize_canvas();});
}

GameEngine.prototype.resize_canvas = function() {
    var aspectRatio = window.innerWidth / window.innerHeight;
    var newHeight = this.width / aspectRatio;
    this.canvas.height = newHeight;
    this.height = newHeight;

    for (var i = 0; i < this.uiObjects.length; i++) {
        if (this.uiObjects[i].resize)
            this.uiObjects[i].resize(this.canvas);
    }
    if (this.world)
        this.draw();
}
 
/**
 * Runs the game loop
 */
GameEngine.prototype.run = function() {
    var desiredTime = Date.now() + this.FPS;
 
    this.update();
    this.draw();

    var engine = this;
 
    var interval = Math.max(0, desiredTime-Date.now());
    setTimeout( function() { engine.run() }, interval); // basic infinite loop
}
 
/**
 * Updates the logic of the game with all the game objects
 */
GameEngine.prototype.update = function() {
    for (var i = 0; i < this.uiObjects.length; i++) {
        this.uiObjects[i].update(this.mouse);
    }
}
 
/**
 * Updates the logic of the game with all the game objects
 */
GameEngine.prototype.sendUpdate = function() {
    if ( this.player ) {
        var m = { x: this.mouse.x - this.cam.x,
                  y: this.mouse.y - this.cam.y,
                  clicked: this.mouse.clicked,
                  down: this.mouse.down };
        socket.emit('input',{index:this.player.index, mouse:m, keys:Keys});
    }
}
 
/**
 * Draws the game with all the game objects
 */
GameEngine.prototype.draw = function() {
    this.context2D.setTransform(1,0,0,1,0,0); // reset the transform matrix as it is cumulative
    this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);//clear the viewport AFTER the matrix is reset

    this.cam.x = 0;
    this.cam.y = 0;
    //Clamp the camera position to the world bounds while centering the camera around the player   
    if ( this.player )
    {
        this.cam.x = -this.player.x + this.canvas.width/2;
        this.cam.y = -this.player.y + this.canvas.height/2;
        if ( this.world )
        {
            this.cam.x = clamp(this.cam.x, -this.world.rightSide() + this.canvas.width, -this.world.leftSide());
            this.cam.y = clamp(this.cam.y, -this.world.bottomSide() + this.canvas.height, -this.world.topSide());
        }
    }
    this.context2D.translate( this.cam.x, this.cam.y );
    this.world.draw(this.context2D);

    var sprites = [];
    for (var type = 0; type < this.gameObjects.length; type++) {
        for (var i = 0; i < this.gameObjects[type].length; i++) {
            if (this.gameObjects[type][i]) 
                sprites.push(this.gameObjects[type][i]);
        }
    }
    sprites.sort(function(a,b) {
        if (a.type === "SNOW_PILE" || b.type === "PROJECTILE")
            return -1;
        if (b.type === "SNOW_PILE" || a.type === "PROJECTILE")
            return 1;
        return a.y-b.y;
    });
    for (var i = 0; i < sprites.length; i++) {
        sprites[i].draw(this.context2D);
    }

    this.context2D.setTransform(1,0,0,1,0,0); // reset the transform matrix before drawing ui elements
    // this.context2D.translate( -this.cam.x, -this.cam.y );
    for (var i = 0; i < this.uiObjects.length; i++) {
        this.uiObjects[i].draw(this.context2D);
    }
}