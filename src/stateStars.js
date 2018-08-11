var stars = [];

function AddStar()
{
    let newStar = new Star(stars.length * 10, stars.length * 10);
    stars.push(newStar);
    aw.addEntity(newStar);
}

function enterStarState()
{
    aw.state = starState;
    aw.clearAllEntities();
    stars = [];
    AddStar();
}

function starState(deltaTime)
{
    // Test audio when you press 'a'
    if (aw.keysJustPressed.a)
    {
        aw.playAudio("boing.wav");
    }

    // Test adding or removing stars when you press 'space' / 'backspace'
    if (aw.keysJustPressed.space)
    {
        let newStar = new Star(stars.length * 10, stars.length * 10);
        stars.push(newStar);
        aw.addEntity(newStar);
    }
    else if (aw.keysJustPressed.backspace && stars.length > 0)
    {
        let starToRemove = stars.pop();
        aw.removeEntity(starToRemove);
    }

    // Test sorting stars when you press 'up' / 'down'
    if (aw.keysJustPressed.up)
    {
        stars.forEach((entity, index) =>
        {
            entity.z = stars.length - index;
        });
    }
    else if (aw.keysJustPressed.down)
    {
        stars.forEach((entity, index) =>
        {
            entity.z = index;
        });
    }

    // Test switching states when you press 's'
    if (aw.keysJustPressed.s)
    {
        enterTextState();
    }
}