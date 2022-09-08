function player(nick, num)
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

    this.num = num;

    this.asset = [ // 플레이어로써 출력 될 이미지.
        // 이미지는 총 8개 (우주선의 8방향)
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125156905132062/nothrust_roc_down.png', // down
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125157253251122/nothrust_roc_left.png', // left
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125159811780698/nothrust_roc_up.png', // up
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125158326992936/nothrust_roc_right.png', // right
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125157597192302/nothrust_roc_leftdown.png', // leftdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125157957914634/nothrust_roc_leftup.png', // leftup
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125158779998239/nothrust_roc_rightdown.png', // rightdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125159203602492/nothrust_roc_rightup.png' // rightup
    ];

    this.thrustAsset = [ // 플레이어가 방향키를 눌렀을 때 출력 될 이미지.
        // 이미지는 총 8개 (우주선의 8방향)
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166810898448425/roc_down.png', // down
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166811351420968/roc_left.png', // left
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166813691850784/roc_up.png', // up
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166812471316590/roc_right.png', // right
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166811691171860/roc_leftdown.png', // leftdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166812056068106/roc_leftup.png', // leftup
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166812873949254/roc_rightdown.png', // rightdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166813284995123/roc_rightup.png' // rightup
    ];

    this.radius = 40; // 반지름
    this.color = "#FF00FF"; // 닉네임 색
    this.x = WIDTH / 2; // x 좌표
    this.y = HEIGHT - this.radius; // y 좌표
    // 플레이어가 방향키를 누르고 있을 때 x좌표가 이만큼, y좌표가 이만큼 움직인다는 뜻을 변수로 표현.
    this.thrusting = false;
    this.thrust = {
        x : 0,
        y : 0
    }
    this.player = new Image();
    this.player.src = this.asset[2]; // 플레이어의 현재 이미지. 방향키를 누를때 바뀐다.
    this.score = 0; // 플레이어의 현재 점수
    this.explodeTime = 0; // 플레이어 폭발 시간. 플레이어가 장애물에 피격당했을 때 변수에 값이 대입된다.
    this.blinkTime = 0;
    this.blinkNum = 0;

    this.stunTime = 0;
    this.stunNum = 0;

    this.itemImg = new Image();
    this.itemPocket = 0;
}