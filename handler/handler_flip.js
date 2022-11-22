module.exports = (io, socket, room) => {
  /** 카드를 섞는 함수 */
  function shuffle(index) {
    var i;
    var k;
    var holder;
    var dl = room[index].card_deck.length;

    for (var j = 0; j < dl * 3; j++) {
      i = Math.floor(Math.random() * dl);
      k = Math.floor(Math.random() * dl);

      holder = room[index].card_deck[k];
      room[index].card_deck[k] = room[index].card_deck[i];
      room[index].card_deck[i] = holder;
    }
  }

  socket.on("flip_is_ready", (id) => {
    // 뒤집기쥰비완료쓰
    let Index = room.findIndex((e) => e.userid.includes(id));
    if(Index < 0) return;
      room[Index].cnt += 1;
      if (room[Index].cnt == room[Index].players.length) {
        let flip_time = room[Index].players.length > 3 ? 64000 : 94000;
        shuffle(Index);
        io.to(room[Index].roomCode).emit("flip_start", room[Index].card_deck); // 뒤집기수타투
        room[Index].cnt = 0;
        setTimeout(() => {
          io.to(room[Index].roomCode).emit("flip_end");
        }, flip_time);
      }
  });

  // 첫번째인지 두번째인지 이 메시지에서 공통으로 처리해서 체크
  socket.on("flip", (data) => {
    // 이카드뒤집혔대
    const { id, c_index } = data;
    console.log(c_index);
    let Index = room.findIndex((e) => e.userid.includes(id));
    if(Index < 0) return;
    socket.broadcast.to(room[Index].roomCode).emit("card_fliped", c_index); // 카드뒤집음
  });

  socket.on("card_will_check", (data) => {
    // 카드 체크한대
    const { id, c_index, check } = data;
    let Index = room.findIndex((e) => e.userid.includes(id));
    if(Index < 0) return;
    console.log(c_index);
    if (check)
      socket.broadcast.to(room[Index].roomCode).emit("card_matched", c_index);
    //맞췄대
    else
      socket.broadcast
        .to(room[Index].roomCode)
        .emit("card_not_matched", c_index); // 못맞췄대
  });
};
