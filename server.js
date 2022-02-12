const dotenv = require('dotenv');
dotenv.config();

const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

const pool = new Set();

io.on('connection', (socket) => {
  console.log('A connection was established');
  socket.on('disconnect', () => {
    console.log('A connection was disconnected');
  });
  socket.on('claim-room', (data) => {
    const canAdd = !pool.has(data.room);
    if (canAdd) pool.add(data.room);
    io.emit('confirm-room', { canAdd, id: data.id });
  });
  socket.on('unclaim-room', (data) => {
    pool.delete(data.room);
  });
  socket.on('request-buzz', (data) => {
    io.emit('display-buzz', data);
  });
  socket.on('update-score', (data) => {
    io.emit('display-score', data);
  });
});

app.use(compression());
app.use(morgan('dev'));

server.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
