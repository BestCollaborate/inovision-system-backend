const app = require('express')();
const { Server } = require('socket.io');

// const server = require('http').createServer(app);
exports.createSockerServer = function (server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    
    const rooms = {};
    io.on('connection', (socket) => {
        console.log(socket.id + ' user connected');
        socket.on('create-room', (data) => {
            const { lectureId } = data;
            console.log('user created room ===> ' + lectureId);
            socket.join(lectureId);
        });
        socket.on('join-room', (data) => {
            const { lectureId, role } = data;
            console.log('user joined room ===> ' + lectureId);
            const existingRoom = rooms[lectureId] || { chat: [] };
            rooms[lectureId] = { ...existingRoom, [role]: socket.id }
            socket.join(lectureId);
        });
    
        socket.on('send-message', (data) => {
            const { lectureId, userId, message } = data;
            console.log('user sent message ===> ' + message);
            rooms[lectureId].chat.push({ message, userId });
            socket.to(lectureId).emit('message', rooms[lectureId].chat);
            socket.emit('message', rooms[lectureId].chat);
        });
    
        socket.on('raise-hand', (data) => {
            const { lectureId, userId } = data;
            console.log('user raised hand ===> ' + userId);
            const teacher = rooms[lectureId]?.teacher;
            console.log(teacher);
            if (teacher) {
                io.to(teacher).emit('raise-hand', { userId });
            }
        });
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}