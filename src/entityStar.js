class Star
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.angle = 0;
    }

    update(deltaTime)
    {
        this.angle = (this.angle + deltaTime*45) % 360;
    }

    render()
    {
        aw.drawSprite({name: "star.png", x: this.x + 50, y: this.y + 50, angle: this.angle, xScale: 0.5, yScale: 0.5});
    }
}