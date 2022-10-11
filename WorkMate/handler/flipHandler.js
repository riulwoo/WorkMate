module.exports = (io, socket, room) => {
    const cycle
    /** 카드를 섞는 함수 */
    function shuffle() {
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

    socket.on('뒤집기쥰비완료쓰', (id)=>{
      let Index = room.findIndex(e => e.userid.includes(id));
      if (Index !== -1) {
      room[Index].cnt += 1;
        if(room[Index].cnt == room[Index].players.length) {
          shuffle();
          io.to(room[Index].roomCode).emit('뒤집기수타투', room[index].card_deck);
          room[Index].cnt = 0;
        }
      }
    })

  // 첫번째인지 두번째인지 이 메시지에서 공통으로 처리해서 체크
  socket.on('이카드 뒤집혔대', (data)=>{
    
  })

  
}