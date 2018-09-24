class StarState
{
    enter()
    {
        aw.clearAllEntities();

        this.stars = [];
        this.addStar();

        aw.addEventListener("MyEvent1", this);
        aw.addEventListener("MyEvent2", this);

        aw.createCamera("game", 0, 0);
        aw.setCamera("game");
    }

    exit()
    {
        aw.removeEventListener("MyEvent1", this);
        aw.removeEventListener("MyEvent2", this);
    }

    addStar()
    {
        let newStar = new Star(this.stars.length * 10, this.stars.length * 10);
        this.stars.push(newStar);
        aw.addEntity(newStar);
    }

    removeStar()
    {
        if (this.stars.length > 0)
        {
            let starToRemove = this.stars.pop();
            aw.removeEntity(starToRemove);
        }
    }

    preUpdate(deltaTime)
    {
        // Test audio when you press 'a'
        if (aw.keysJustPressed["a"])
        {
            aw.playAudio("boing.wav");
        }

        // Test event handling when you press 'e' / 'r'
        if (aw.keysJustPressed["e"])
        {
            aw.broadcastEvent("MyEvent1", 1234);
        }
        else if (aw.keysJustPressed["r"])
        {
            aw.broadcastEvent("MyEvent2", "Test Arg", 500);
        }

        // Test adding or removing stars when you press 'space' / 'backspace'
        if (aw.keysJustPressed[" "])
        {
            this.addStar();
        }
        else if (aw.keysJustPressed["backspace"])
        {
            this.removeStar();
        }

        // Test sorting stars when you press 'up' / 'down'
        if (aw.keysJustPressed["arrowup"])
        {
            this.stars.forEach((entity, index) =>
            {
                entity.z = this.stars.length - index;
            });
        }
        else if (aw.keysJustPressed["arrowdown"])
        {
            this.stars.forEach((entity, index) =>
            {
                entity.z = index;
            });
        }

        // Test moving the camera when you press 'left' / 'right'
        let gameCamera = aw.getCamera("game");
        let speedPerSec = 50;
        if (aw.keys["arrowleft"])
        {
            gameCamera.x -= speedPerSec * deltaTime;
        }
        if (aw.keys["arrowright"])
        {
            gameCamera.x += speedPerSec * deltaTime;
        }

        // Test screen shake when you press 't'
        if (aw.keysJustPressed["t"])
        {
            aw.startCameraShake("game", 5.0, 2.0);
        }

        // Test switching states when you press 's'
        if (aw.keysJustPressed["s"])
        {
            aw.switchState(new TextState());
        }
    }

    onMyEvent1(value)
    {
        console.log(`Event handler #1: ${value}`);
    }

    onMyEvent2(str, num)
    {
        console.log(`Event handler #2: ${str} - ${num}`);
    }
}