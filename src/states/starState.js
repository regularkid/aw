class StarState
{
    enter()
    {
        aw.clearAllEntities();

        this.stars = [];
        this.addStar();
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
                entity.z = stars.length - index;
            });
        }
        else if (aw.keysJustPressed["arrowdown"])
        {
            this.stars.forEach((entity, index) =>
            {
                entity.z = index;
            });
        }

        // Test switching states when you press 's'
        if (aw.keysJustPressed["s"])
        {
            aw.switchState(new TextState());
        }
    }
}