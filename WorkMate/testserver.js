// server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/** Import Router */
const testRouter = require('./router/pageRouter');

/** Import SocketHandler */
// const mainHandlers = require('./socketHandler/mainHandler');
// const oxHandlers = require('./socketHandler/oxHandler');
// const flipHandlers = require('./socketHandler/flipHandler');
// const raceHandlers = require('./socketHandler/raceHandler');
import { init, onConnection } from "./model/func_conn.js";

/** Set Middleware */
app.use(express.static('views'));
app.use(express.static('game'));

/** Set Routers */
app.use('*', testRouter);

let room = init();
io.on('connection', onConnection(room));

server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});