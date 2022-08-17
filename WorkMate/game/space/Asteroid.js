function Asteroid(pos, r) // 생성자.
{
    if (pos) // 매개변수로 넣은 pos 값이 음수가 아니라면
    {
        this.pos = pos.copy();
    }
    else
    {
        this.pos = createVector(random(width), random(height));
    }

    if (r)
    {
        this.r = r * 0.5;
    }
    else
    {
        this.r = random(25, 70);
    }

    this.vel = p5.Vector.random2D();
    this.total = floor(random(15, 50));
    this.offset = [];
    this.colorR = floor(random(10, 255));
    this.colorG = floor(random(10, 255));
    this.colorB = floor(random(10, 255));

    for (var i = 0; i < this.total; i++)
    {
        this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
    }

    this.update = function()
    {
        this.pos.add(this.vel);
    }

    this.render = function()
    {
        push();
        fill(this.colorR, this.colorG, this.colorB);
        stroke(255);
        translate(this.pos.x, this.pos.y);
        beginShape();

        for (var i = 0; i < this.total; i++)
        {
            var angle = map(i, 0, this.total, 0, TWO_PI);
            var r = this.r + this.offset[i];
            var x = r * cos(angle);
            var y = r * sin(angle);
            vertex(x, y);
        }

        endShape();
        pop();
    }

    this.displaced = function() // 장애물과 함선이 충돌 시 장애물이 두개로 나뉘어 생성됨.
    {
        var newA = [];
        newA[0] = new Asteroid(this.pos, this.r);
        newA[1] = new Asteroid(this.pos, this.r);
        return newA;
    }

    this.edges = function() // 장애물이 화면 밖으로 나가면 반대편에서 나타나게 됨
    {
        if (this.pos.x > width + this.r)
        {
            this.pos.x = -this.r;
        }
        else if (this.pos.x < -this.r)
        {
            this.pos.x = width + this.r;
        }

        if (this.pos.y > height + this.r)
        {
            this.pos.y = -this.r;
        }
        else if (this.pos.y < -this.r)
        {
            this.pos.y = height + this.r;
        }
    }
}