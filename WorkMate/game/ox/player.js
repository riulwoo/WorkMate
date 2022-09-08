module.exports = {player};
  
function player(nick)
{
    // 플레이어 닉네임 설정
    if (nick == null)
    {
        this.nick = "player" + Math.floor(Math.random() * 100);
    }
    else
    {
        this.nick = nick;
    }

    this.asset = [ // 플레이어 이동 시 출력 될 이미지.
        // 순서대로 정면(방향키 아래), 좌측, 후면(방향키 위), 우측 
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271208226881606/1.png',
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271240271376385/4.png',
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271284735193139/4.png',
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271430722146345/3.png'
    ];

    this.color = "#FF00FF";
    this.x = 1200 / 2;
    this.y = 800 / 2;
    this.player = new Image();
    this.player.src = this.asset[0];
    this.score = 0;

    // 판정 관련
    this.is_O;
}