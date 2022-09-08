function newAsteroid_of_item(x, y, num)
{
    const ROIDS_JAG = Math.random(); // jaggedness of the asteroids (0 = none, 1 = lots)
    const ROIDS_SPD = 75; // Math.floor(Math.random() * (50 - 25) + 25); // max starting speed of Asteroids in pixels per second.
    const ROIDS_VERT = Math.floor(Math.random() * (16 - 8) + 8); // average number of vertices on each Asteroid

    this.x = x;
    this.y = y;
    this.num = num;

    this.xv = Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1);
    this.yv = Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1);

    this.radius = 25;
    this.a = Math.random() * Math.PI * 2;
    this.vert = Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2);

    this.offs = [];

    for (var i = 0; i < this.vert; i++)
    {
        this.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
    }
}