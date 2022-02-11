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

io.on('connection', (socket) => {
  console.log('A connection was established');
  socket.on('disconnect', () => {
    console.log('A connection was disconnected');
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
