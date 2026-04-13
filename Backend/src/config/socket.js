const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('joinBusinessRoom', (businessId) => {
            socket.join(`business_${businessId}`);
            console.log(`Socket ${socket.id} joined room business_${businessId}`);
        });

        socket.on('leaveBusinessRoom', (businessId) => {
            socket.leave(`business_${businessId}`);
            console.log(`Socket ${socket.id} left room business_${businessId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIO };
