function Card(x, y, info)
{
    this.x = x;
    this.y = y;
    // this.width = width;
    // this.height = height;
    this.info = info; // 카드가 어떤 문양인지를 저장하는 정보
    /* 1 = 커피 / 2 = 노트북 / 3 = 서류더미 / 4 = 프린터 / 5 = 월급 / 6 = 계산기 / 7 = 폭탄 / 8 = 이미 맞춰진 카드 */
    this.poly = 0; // 0일 때, 카드는 안뒤집힘(뒷면). 1일때 카드는 뒤집힘(앞면).
    this.isMine = true; // 자신이 뒤집은 카드일 경우만 true, 다른 사람이 뒤집은 카드면 뒤집을 수 없음
    this.untouchable = false; // true일 때, 뒤집을 수 없는 카드.

    this.card_asset = new Image();
    
    this.draw = function()
    {
        if (!this.untouchable)
        {
            this.card_asset.src = card_asset_index[this.poly * this.info];
        }
        else
        {
            this.card_asset.src = card_asset_index[8];
        }
        flip_ctx.drawImage(this.card_asset, this.x, this.y, card_width, card_height);
        flip_ctx.beginPath();
        flip_ctx.fillStyle = "#F5FFFA";
        flip_ctx.font = "35px DungGeunMo";
        flip_ctx.textAlign = "center";
        //flip_ctx.fillText(this.info, this.x + card_width / 2, this.y + card_height / 2);
        flip_ctx.closePath();
    }
}