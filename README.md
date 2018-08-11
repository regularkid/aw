# aw
Micro Framework for HTML5 Games

Inspried / influenced by the awesome Ga engine (https://github.com/kittykatattack/ga), I thought it would be fun to take my own stab at making a micro framework for javascript games! I'll be using this for the 2018 js13kgames competition (http://js13kgames.com/).

## Features:
+ Asset loader
+ Game loop
+ State system
+ Sortable entity system
+ Sprite renderer
+ Text renderer
+ Input system
+ ~300 lines of code
+ ~2kb minified and zipped

## Micro Tutorial
1. Grab aw.js and plop that bad boy into your project.
2. Add a div in your HTML with id="game".
3. Add a single line of code to start everything up: `var aw = new Aw(screenWidth, screenHeight, screenScale, assetList);`

Example:
```javascript
var aw = new Aw(320, 240, 2.0, ["star.png", "boing.wav"]);
```

3. Create an update function that will be called every frame:
```javascript
aw.state = myUpdate;
function myUpdate(deltaTime)
{
    // Do stuff here
}
```

4. Check out the example code (everything in this repository that isn't aw.js) to see how to:
+ Check for input
+ Change states
+ Draw sprites and text
+ Create and remove entities
+ Set entity sort order

Have fun!