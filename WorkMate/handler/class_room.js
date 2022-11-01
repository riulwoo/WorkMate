module.exports = class userroom {
  // 클라이언트 코드에도 작성해야함 : 같이 플레이하는 유저의 정보도 알아야 게임이 됨
  constructor() {
    this.check = ""; // 생성된 방이 matching 인지 private인지 체크
    this.roomCode = null; // 방 코드
    this.gameName = ["survival"]; // 게임배열 랜덤으로 게임을 시작하기위한 변수
    //this.gameName = ["ox_quiz", "flip_over", "survival"]; // 게임배열 랜덤으로 게임을 시작하기위한 변수
    this.users = []; // 플레이어 1~6명의 정보
    this.cnt = 0; // 준비상태를 체크하기 위한 카운터 변수
    this.readyIndex = []; //방안에 유저들이 레디했는지 체크하는 변수
    this.cur_quiz_index = [];
    this.card_deck = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    ];
    this.goal
    for (let i = 0; i < 6; i++) {
      this.users.push({ id: null, nick: null, score: null });
    }
    this.players = []; // 실제 게임을 할 플레이어 정보
  }

  rIndexUpdate(id) {
    this.readyIndex = this.readyIndex.filter((e) => e !== id);
  }

  game() {
    if (this.gameName.length > 0) {
      const select =
        this.gameName[Math.floor(Math.random() * this.gameName.length)];
      const result = this.gameName.filter((e, i) => {
        if (e !== select) return e;
      });
      this.gameName = result;
      console.log(`방에 저장된 게임 목록 : ${this.gameName}`);
      console.log(`선택된 게임 : ${select}`);
      return select;
    } else "result";
  }

  // 최종 플레이어 id값, 닉네임 null없는 배열 반환
  pushplayers() {
    const player = this.users.filter((e, i) => {
      const { id, nick, score } = e;
      if (e.id != null) return { id, nick, score };
    });
    this.players = player;
    return player;
  }

  // 유저 삭제
  deleteUser(id, i) {
    let a = 0;
    console.log(`함수의 매개변수 id : ${id}`);
    if (this.users[i].id === id) {
      this.users.splice(i, 1);
      this.users.push({ id: null, nick: null, score: null });
    }
    this.users.forEach((player, index) => {
      if (player.id == null) a++;
    });
    if (a == 6) return true;
  }

  // id값 출력
  get userid() {
    const usersId = this.users.map((user) => user.id);
    return usersId;
  }

  // nick 출력
  get usernick() {
    const usersNick = this.users.map((user) => user.nick);
    return usersNick;
  }
  // 매칭시 player1~6까지 null이 있는지 체크, null이 없다면 false반환
  insertuserid(data) {
    const { id, roomid, nick, score } = data;
    for (let i = 0; i < 6; i++) {
      if (this.roomCode != null && this.users[5].id != null) {
        console.log("여기 들어왔다구");
        return false;
      } else if (this.roomCode != null && this.users[i].id == null) {
        this.users.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      } else if (this.roomCode == null) {
        this.users.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      }
    }
  }

  score(id, score) {
    const i = this.players.findIndex((e) => e.id == id);
    this.players[i].score = score;
  }
};
