const userroom = require('./class_room');

function init() {
  let room = new Array();
  room[0] = new userroom();
  return room;
}

function onConnection(socket, room) {
  console.log(`${socket.id}님이 입장하셨습니다.`);
  mainHandlers(io, socket, room);
  oxHandlers(io, socket, room);
  flipHandlers(io, socket, room);
  raceHandlers(io, socket, room);
  
  //   // 나중에 게임 연결 성공하면 to(room)에게 보내주는 형태로 수정
  // socket.on('send_location', function(data) {
  //         socket.broadcast.emit('update_state', {
  //             id: data.id,
  //             x: data.x,
  //             y: data.y,
  //         })
  // })
}

module.exports = {
  init,
  onConnection
}