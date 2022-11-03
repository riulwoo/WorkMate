const userroom = require('./class_room');

module.exports = function test() {
  let room = new Array();
  room[0] = new userroom();
  return room;
}
