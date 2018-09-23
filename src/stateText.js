var textX = 160;
var textY = 70;
var textAngle = 0;
var bounceAngle = 0;

function enterTextState()
{
    aw.state = textState;
    aw.clearAllEntities();
}

function textState(deltaTime)
{
    // Test switching states when you press 's'
    if (aw.keysJustPressed["s"])
    {
        enterStarState();
    }

    // Test moving the text using the arrow keys
    let speedPerSec = 50;
    if (aw.keys["arrowleft"])
    {
        textX -= speedPerSec * deltaTime;
    }
    if (aw.keys["arrowright"])
    {
        textX += speedPerSec * deltaTime;
    }
    if (aw.keys["arrowup"])
    {
        textY -= speedPerSec * deltaTime;
    }
    if (aw.keys["arrowdown"])
    {
        textY += speedPerSec * deltaTime;
    }

    // Test rotating the text using 'z' / 'x'
    let rotationPerSec = 180;
    if (aw.mouseButtons[0])
    {
        textAngle += rotationPerSec * deltaTime;
    }
    if (aw.mouseButtons[2])
    {
        textAngle -= rotationPerSec * deltaTime;
    }

    // Bounce the text to test scaling
    bounceAngle = (bounceAngle + 360*deltaTime) % 360;
    let bounceAngleRad = bounceAngle * (Math.PI / 180);
    let textSize = 20 + Math.abs(Math.sin(bounceAngleRad))*7.0;

    aw.drawText({text: "Hello World!", x: textX, y: textY, angle: textAngle, color: "#00FF00",
                 fontName: "Arial", fontSize: textSize, fontStyle: "bold", textAlign: "center", textBaseline: "middle"});
}