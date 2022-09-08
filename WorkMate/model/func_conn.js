const userroom = require('./class_room');

module.exports = function init() {
  let room = new Array();
  room[0] = new userroom();
  return room;
}
