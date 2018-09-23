class TextState
{
    enter()
    {
        this.textX = 160;
        this.textY = 70;
        this.textAngle = 0;
        this.bounceAngle = 0;

        aw.clearAllEntities();
    }

    preUpdate(deltaTime)
    {
        // Test moving the text using the arrow keys
        let speedPerSec = 50;
        if (aw.keys["arrowleft"])
        {
            this.textX -= speedPerSec * deltaTime;
        }
        if (aw.keys["arrowright"])
        {
            this.textX += speedPerSec * deltaTime;
        }
        if (aw.keys["arrowup"])
        {
            this.textY -= speedPerSec * deltaTime;
        }
        if (aw.keys["arrowdown"])
        {
            this.textY += speedPerSec * deltaTime;
        }

        // Test rotating the text using 'z' / 'x'
        let rotationPerSec = 180;
        if (aw.mouseButtons[0])
        {
            this.textAngle += rotationPerSec * deltaTime;
        }
        if (aw.mouseButtons[2])
        {
            this.textAngle -= rotationPerSec * deltaTime;
        }

        // Bounce the text to test scaling
        this.bounceAngle = (this.bounceAngle + 360*deltaTime) % 360;
        let bounceAngleRad = this.bounceAngle * (Math.PI / 180);
        let textSize = 20 + Math.abs(Math.sin(bounceAngleRad))*7.0;

        aw.drawText({text: "Hello World!", x: this.textX, y: this.textY, angle: this.textAngle, color: "#00FF00",
                    fontName: "Arial", fontSize: textSize, fontStyle: "bold", textAlign: "center", textBaseline: "middle"});

        // Test switching states when you press 's'
        if (aw.keysJustPressed["s"])
        {
            aw.switchState(new StarState());
        }
    }
}