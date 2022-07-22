function Gate()
{
    this.pos = createVector(width / 2, height / 2);
    this.r = 40;
    this.rotation = 0;
    this.heading = 0; // 회전한 정도.
    
    this.blink = function()
    {
        if (this.pos.x < width / 2)
        {
            this.pos.x = random(width / 2, width - this.r);
        }
        else if (this.pos.x > width / 2)
        {
            this.pos.x = random(this.r, width / 2);
        }
        else if (this.pos.x = width / 2)
        {
            this.pos.x = random(this.r, width - this.r);
        }
        this.pos.y = random(this.r, height - this.r);
        this.heading = 0;
    }

    this.render = function()
    {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading + PI / 2);
        stroke('#D3D3D3');
        strokeWeight(10);
        fill(255, 255, 255);
        square(-20, -20, this.r);
        pop();
    }

    this.hits = function()
    {

    }

    // this.setRotation = function(a)
    // {
    //     this.rotation = a;
    // }

    this.turn = function()
    {
        this.heading += 0.1;
    }
}