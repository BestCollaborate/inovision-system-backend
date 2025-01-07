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
            if(rooms[lectureId]) {
                socket.emit('message', rooms[lectureId].chat)
            }
        });
    
        socket.on('send-message', (data) => {
            const { lectureId, userId, message, role } = data;
            console.log('user sent message ===> ' + message);
            const currentDate = new Date();

            rooms[lectureId].chat.push({ 
                message, 
                userId, 
                role, 
                date: `${String(currentDate.getHours()).padStart(2, 0)}:${String(currentDate.getMinutes()).padStart(2, 0)}`,
            });

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

    const whiteboard = {}

    io.of('/whiteboard', (socket) => {
        socket.on('wb-join', (id) => {
            socket.join(id);
            console.log('>>>>>>> wb - join', id, "---");
            if(whiteboard[id]) {
                socket.emit('wb-init', whiteboard[id]);
            }
        });

        socket.on('wb-update', ({ data, roomId }) => {
            // whiteboard[id] = data;
            console.log(roomId, data);
            socket.to(roomId).emit("wb-update", data);
            console.log(roomId, data)
        })
    })
}