var screenWidth = 640;
var screenHeight = 480;
var screenScale = 1.0;

var aw = new Aw(screenWidth, screenHeight, screenScale, ["star.png", "boing.wav"]);

aw.switchState(new StarState());