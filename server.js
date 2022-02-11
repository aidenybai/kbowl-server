const dotenv = require('dotenv');
dotenv.config();

const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A connection was established');
  socket.on('disconnect', () => {
    console.log('A connection was disconnected');
  });
  socket.on('client-buzz', (data) => {
    io.emit('server-buzz', data);
  });
  socket.on('client-score', (data) => {
    io.emit('server-score', data);
  });
});

app.use(compression());
app.use(morgan('dev'));

server.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
