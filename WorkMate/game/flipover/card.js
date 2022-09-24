function Card(x, y, number)
{
    this.x = x;
    this.y = y;
    // this.width = width;
    // this.height = height;
    this.number = number; // 앞면인지 뒷면인지를 지정할 정보

    

    this.draw = function(){
        ctx.drawImage(card_asset, this.x, this.y);
    }
}