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

const pool = new Map();

function getByValue(map, searchValue) {
  for (const [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
}

io.on('connection', (socket) => {
  console.log('A connection was established');
  socket.on('disconnect', () => {
    if ([...pool.values()].includes(socket.id)) {
      pool.delete(getByValue(socket.io));
      console.log(`${socket.id} unclaimed ${getByValue(socket.io)}`);
      console.log(
        `Current sessions (${pool.size}): ${[...pool.keys()].join(', ')}`
      );
    }
    console.log('A connection was disconnected');
  });
  socket.on('claim-room', (data) => {
    const canAdd = !pool.has(data.room);
    if (canAdd) pool.set(data.room, data.id);
    io.emit('confirm-room', { canAdd, id: data.id });
    console.log(`${data.id} claimed ${data.room}`);
    console.log(
      `Current sessions (${pool.size}): ${[...pool.keys()].join(', ')}`
    );
  });
  socket.on('unclaim-room', (data) => {
    pool.delete(data.room);
    console.log(`${data.id} unclaimed ${data.room}`);
    console.log(
      `Current sessions (${pool.size}): ${[...pool.keys()].join(', ')}`
    );
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
