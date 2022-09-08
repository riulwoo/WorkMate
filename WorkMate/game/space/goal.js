function newGoal()
{
    this.radius = 13;
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    
    // this.rot = -GOAL_TURN_SPEED / 180 * Math.PI / FPS;
    // this.a = 90 / 180 * Math.PI;

    this.blink = function()
    {
        if (this.x < WIDTH / 2)
        {
            this.x = Math.floor(Math.random() * ((WIDTH - this.radius) - (WIDTH / 2)) + (WIDTH / 2));
        }
        else if (this.x > WIDTH / 2)
        {
            this.x = Math.floor(Math.random() * ((WIDTH / 2) - this.radius) + this.radius);
        }
        else if (this.x == WIDTH  / 2)
        {
            this.x = Math.floor(Math.random() * ((WIDTH - this.radius) - this.radius) + this.radius);
        }
        this.y = Math.floor(Math.random() * ((HEIGHT - this.radius) - this.radius) + this.radius);
        // this.a = 90 / 180 * Math.PI;
    }
}