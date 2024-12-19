const app = require('express')();
const { Server } = require('socket.io');

const server = require('http').createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const port = process.env.PORT || 8001;
const rooms = {};
io.on('connection', (socket) => {
    console.log(socket.id + ' user connected');
    socket.on('create-room', (data) => {
        const { lectureId } = data;
        console.log('user created room ===> ' + lectureId);
        socket.join(lectureId);
    });
    socket.on('join-room', (data) => {
        const { lectureId } = data;
        console.log('user joined room ===> ' + lectureId);
        rooms[lectureId] = { chat: [] }
        socket.join(lectureId);
    });

    socket.on('send-message', (data) => {
        const { lectureId, userId, message } = data;
        console.log('user sent message ===> ' + message);
        rooms[lectureId].chat.push({ message, userId });
        socket.to(lectureId).emit('message', rooms[lectureId].chat);
        socket.emit('message', rooms[lectureId].chat);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

module.exports = server;