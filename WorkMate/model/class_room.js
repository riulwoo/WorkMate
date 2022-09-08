module.exports = class userroom { 
  // 클라이언트 코드에도 작성해야함 : 같이 플레이하는 유저의 정보도 알아야 게임이 됨
  constructor(){
    this.check = '';              // 생성된 방이 matching 인지 private인지 체크
    this.roomCode = null;         // 방 코드
    this.gameName = ['ox', 'space', 'flipOver'];   // 게임배열 랜덤으로 게임을 시작하기위한 변수
    this.users = [];          // 플레이어 1~6명의 정보
    for (let i = 0; i < 6; i++) {
      this.users.push({ id: null, nick: null, score: null });
    }
    this.players = [];        // 실제 게임을 할 플레이어 정보
  }

  game(){
    if(this.gameName.length > 0) {
      const select = this.gameName[Math.floor(Math.random() * this.gameName.length)];
      const result = this.gameName.filter((e, i) => {
       if(e !== select) return e; 
      });
      this.gameName = result;
      console.log(`방에 저장된 게임 목록 : ${this.gameName}`);
      console.log(`선택된 게임 : ${select}`);
      return select;
    } else console.log(`모든 라운드 종료`);
  }
  
  // 플레이어 정보 입력
  pushplayers(){
    this.users.forEach((e, i) => {
      if(e.id !==null) {
        let player = new PlayerBall(e.id, e.nick);
        this.players[e.id] = player;
      }
    });
    return this.users;
  }

  // 유저 삭제
  deleteUser(id, i) {
    let a = 0;
    console.log(`함수의 매개변수 id : ${id}`);
      if(this.users[i].id === id)
        this.users.splice(i, 1, { id: null, nick: null, score: null });
    this.users.forEach((player, index) => { if(player.id == null) a++;  });
        if(a == 6) return true;
  }
  // id값 출력
  get userid() {
    const usersId = this.users.map((user) => user.id);
    return usersId;
  }

  // 모든 정보 출력
  get usernick(){
    const usersNick = this.users.map((user) => user.nick);
    return usersNick;
  }
  // 매칭시 player1~6까지 null이 있는지 체크, null이 없다면 false반환
  insertuserid(data) {
    const { id, roomid, nick, score } = data;
    for(let i = 0 ; i < 6 ; i++) {
      if(this.roomCode != null && this.users[5].id != null) {
        console.log('여기 들어왔다구');
        return false;
      }else if (this.roomCode != null && this.users[i].id == null) {
        this.users.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      }else if (this.roomCode == null) {
        this.users.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      }
    }
  }
};