# aw
Micro Framework for HTML5 Games

Inspried / influenced by the wonderful Ga engine (https://github.com/kittykatattack/ga), I thought it would be fun to take my own stab at making a micro framework for javascript games! I'll be using this for the 2018 js13kgames competition (http://js13kgames.com/).

## Features:
+ Asset loader
+ Game loop
+ State system
+ Sortable entity system
+ Sprite renderer
+ Text renderer
+ Input system
+ Camera system (including shake!)
+ Game events system
+ ~500 lines of code
+ ~3kb minified and zipped

## Micro Tutorial
1. Grab aw.js and plop that bad boy into your project.
2. Add a div in your HTML with id="game".
3. Add a single line of code to start everything up: `var aw = new Aw(screenWidth, screenHeight, screenScale, assetList);`

Example:
```javascript
var aw = new Aw(320, 240, 2.0, ["star.png", "boing.wav"]);
```

4. Create a state and tell the engine to switch to it:
```javascript
class MyState
{
    // Optional functions:
    enter() {}
    exit() {}
    preUpdate(deltaTime) {}
    postUpdate(deltaTime) {}
    preRender() {}
    postRender() {}
}

aw.switchState(new MyState());
```

5. Check out the example code (everything in this repository that isn't aw.js) to see how to:
+ Check for input
+ Change states
+ Draw sprites and text
+ Create and remove entities
+ Set entity sort order
+ Adjust the camera
+ Create and send events

Have fun!