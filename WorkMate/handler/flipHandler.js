var server_Deck = [];

module.exports = (io, socket, room) => {

    /** 카드를 세차례 섞는 함수 */
    function shuffle() {
        var i;
        var k;
        var holder;
        var dl = server_Deck.length;

        for (var j = 0; j < dl * 3; j++) {
            i = Math.floor(Math.random() * dl);
            k = Math.floor(Math.random() * dl);

            holder = server_Deck[k].info;
            server_Deck[k].info = server_Deck[i].info;
            server_Deck[i].info = holder;
        }
    }

    /** 카드덱을 만드는 함수. 끝에 shuffle 메서드를 실행시켜 덱을 섞어준다. */
    function make_Deck() {
        var i;
        var j;
        var aCard;
        var cx = firstX;
        var cy = firstY;

        for (i = 1; i <= 5; i++) {
            for (j = 1; j <= 10; j++) {
                if (j > 8) {
                    aCard = new Card(cx, cy, 6);
                    server_Deck.push(aCard);
                }
                else {
                    aCard = new Card(cx, cy, i);
                    server_Deck.push(aCard);
                }
                cx = cx + card_width + card_margin;
            }

            cy = cy + card_height + card_margin;
            cx = firstX;
        }

        shuffle();
    }

    socket.on('쥰비완료쓰', (id)=>{
        server_Deck
    })
}