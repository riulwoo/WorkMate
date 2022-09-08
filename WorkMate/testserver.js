/** server.js */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/** Import Router */
const Router = require('./router/pageRouter');

/** Import SocketHandler */
const mainHandlers = require('./socketHandler/mainHandler');
const oxHandlers = require('./socketHandler/oxHandler');
const flipHandlers = require('./socketHandler/flipHandler');
const raceHandlers = require('./socketHandler/raceHandler');
const { init, onConnection } = require('./model/func_conn');

/** Set Middleware */
app.use(express.static('views'));
app.use(express.static('game'));

/** Set Routers */
app.use('*', Router);

let room = init();
io.on('connection', onConnection(room));

server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});