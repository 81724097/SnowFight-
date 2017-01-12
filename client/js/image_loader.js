

var IMAGE_PACKAGE = "./images/";
var SNOW_BALL_PACKAGE = "snowball/";
var ORANGE_SPRITE_PACKAGE = "orange_sprite/";
var DIRECTION_PACKAGES = ["right_side/","front_side/","left_side/","back_side/"];
var ACTION_PACKAGES = ["walk/","crouch/","pick_up/","throw/"];
var SNOW_WALL_PACKAGE = "snow_wall/";

var DIRECTION_NAMES = ["Right","Front","Left","Back"];
var ACTION_NAMES = ["Walk","Crouch","PickUp","Throw"];

var SNOW_BALL_IMAGES = new Array(30);
var SNOW_WALL_IMAGES = new Array(2);
var ORANGE_SPRITE_IMAGES = new Array(DIRECTION_PACKAGES.length);
var SNOW_PILE_IMAGES;
var SNOW_MAN_IMAGES;
var NUM_SPRITE_FRAMES = [[31,31,36,39],
                         [21,31,25,31],
                         [31,32,37,31],
                         [24,31,25,31]];

var CONTROL_IMAGE_PACKAGE = "controls/";
var CONTROL_IMAGE_NAMES = ["wasd","arrowkeys","shift","space","z","left_mouse"];
var CONTROL_IMAGES = new Array(CONTROL_IMAGE_NAMES.length);

var MAP_IMAGES;
var BIOME = "snow";
(function loadImages() {
    MAP_IMAGES = getImage("snowtile.png");
    for (var i = 0; i < SNOW_BALL_IMAGES.length; i++) {
        SNOW_BALL_IMAGES[i] = getImage(SNOW_BALL_PACKAGE + "snowball_" + i + ".png");
    }
    for (var i = 0; i < SNOW_WALL_IMAGES.length; i++) {
        SNOW_WALL_IMAGES[i] = getImage(SNOW_WALL_PACKAGE + "shaded" + (i+1) + ".png");
    }
    for (var dir = 0; dir < DIRECTION_PACKAGES.length; dir++) {
        ORANGE_SPRITE_IMAGES[dir] = new Array(ACTION_PACKAGES.length);
        for (var a = 0; a < ACTION_PACKAGES.length; a++) {
            ORANGE_SPRITE_IMAGES[dir][a] = new Array(NUM_SPRITE_FRAMES[dir][a]);
            for (var i = 0; i < ORANGE_SPRITE_IMAGES[dir][a].length; i++) {
                var package = ORANGE_SPRITE_PACKAGE + DIRECTION_PACKAGES[dir] + ACTION_PACKAGES[a];
                var file = "OrangeSprite" + DIRECTION_NAMES[dir] + ACTION_NAMES[a] + "_" + pad(i,3) + ".png";
                ORANGE_SPRITE_IMAGES[dir][a][i] = getImage(package + file);
            }
         }
    }
    SNOW_PILE_IMAGES = getImage("snow_pile.png");
    SNOW_MAN_IMAGES = getImage("snowman.png");
    for (var i = 0; i < CONTROL_IMAGE_NAMES.length; i++) {
        CONTROL_IMAGES[i] = getImage(CONTROL_IMAGE_PACKAGE + CONTROL_IMAGE_NAMES[i] + ".png");
    }
})();
function getImage(src)
{
    var img = new Image();
    img.src = IMAGE_PACKAGE + src;
    console.log("loaded " + src);
    return img;
}
function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length-size);
}