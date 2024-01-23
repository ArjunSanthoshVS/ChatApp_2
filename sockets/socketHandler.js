const socketIO = require('socket.io');
const BASE_URL = "https://chat-service-fhbc.onrender.com"
// const BASE_URL = "http://localhost:3000";    
// const BASE_URL = "http://192.168.29.42:3000"

let io;
const memberTokens = {};

module.exports = {
    init: (server) => {
        io = socketIO(server);

        io.on('connection', async (socket) => {
            console.log('Socket Connected');
            let userToken;

            function handleDisconnect(userId) {
                const data = JSON.stringify({ userId });
                fetch(`${BASE_URL}/chat/userLeave`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: data
                })
                    .then(response => {
                        console.log('Data sent successfully (fetch)');
                    })
                    .catch(error => {
                        console.error('Error sending data (fetch):', error);
                    });
            }


            socket.on('join_room', (data) => {
                const { token, room } = data;
                if (token === room._id) {
                    console.log('Admin connected');
                    memberTokens[token] = socket.id;
                } else if (token === room.user) {
                    userToken = token
                    console.log('User connected');
                    memberTokens[token] = socket.id;
                } else {
                    console.log('Localhost Connected');
                    memberTokens[token] = socket.id;
                }
            });

            socket.on('typing', (data) => {
                const { socketSender, socketReceiver } = data;
                const receiverSocketId = memberTokens[socketReceiver];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('user_typing', { socketSender });
                }
            });

            socket.on('send_message', (data) => {
                const { socketSender, socketReceiver, message } = data;
                const senderSocketId = memberTokens[socketSender];
                const receiverSocketId = memberTokens[socketReceiver];
                if (senderSocketId || receiverSocketId) {
                    socket.to(receiverSocketId).emit('receive_message', { socketSender, message });
                } else {
                    console.log('Sender or receiver not found');
                }
            });

            socket.on('send_pdf', (data) => {
                const { socketSender, socketReceiver, content } = data;
                const senderSocketId = memberTokens[socketSender];
                const receiverSocketId = memberTokens[socketReceiver];
                if (senderSocketId || receiverSocketId) {
                    socket.to(receiverSocketId).emit('receive_pdf', content);
                } else {
                    console.log('Sender or receiver not found');
                }
            });

            socket.on('send_image', (data) => {
                const { socketSender, socketReceiver, content } = data;
                const senderSocketId = memberTokens[socketSender];
                const receiverSocketId = memberTokens[socketReceiver];
                if (senderSocketId || receiverSocketId) {
                    socket.to(receiverSocketId).emit('receive_image', content);
                } else {
                    console.log('Sender or receiver not found');
                }
            });

            socket.on('send_video', (data) => {
                const { socketSender, socketReceiver, content } = data;
                const senderSocketId = memberTokens[socketSender];
                const receiverSocketId = memberTokens[socketReceiver];
                if (senderSocketId || receiverSocketId) {
                    socket.to(receiverSocketId).emit('receive_video', content);
                } else {
                    console.log('Sender or receiver not found');
                }
            });

            socket.on('send_location', (data) => {
                const { socketSender, socketReceiver, content } = data;
                const senderSocketId = memberTokens[socketSender];
                const receiverSocketId = memberTokens[socketReceiver];
                if (senderSocketId || receiverSocketId) {
                    socket.to(receiverSocketId).emit('receive_location', content);
                } else {
                    
                    console.log('Sender or receiver not found');
                }
            });

            // socket.on('initiate_VideoCall', (data) => {
            //     console.log(data);
            //     const { socketSender, socketReceiver } = data;
            //     const senderSocketId = memberTokens[socketSender];
            //     const receiverSocketId = memberTokens[socketReceiver];
            //     if (senderSocketId || receiverSocketId) {
            //         console.log(senderSocketId, receiverSocketId);
            //         if (receiverSocketId) {
            //             socket.to(receiverSocketId).emit('receive_videoCall', { socketSender, socketReceiver });
            //         } else {
            //             const adminSocketId = memberTokens["656eaad81a36eeacd8cb6898"]
            //             console.log(adminSocketId);
            //             socket.to(adminSocketId).emit('admin_receive_videoCall', { socketSender, socketReceiver });
            //         }
            //     } else {
            //         console.log('Sender or receiver not found');
            //     }
            // });

            // socket.on('initiate_AudioCall', (data) => {
            //     const { socketSender, socketReceiver } = data;
            //     const senderSocketId = memberTokens[socketSender];
            //     const receiverSocketId = memberTokens[socketReceiver];
            //     if (senderSocketId || receiverSocketId) {
            //         socket.to(receiverSocketId).emit('receive_audioCall', { socketSender, socketReceiver });
            //     } else {
            //         console.log('Sender or receiver not found');
            //     }
            // });

            socket.on('send_video_call', (data) => {
                const { socketSender, socketReceiver, callId, message } = data;
                const senderSocketId = memberTokens[socketSender];
                const receiverSocketId = memberTokens[socketReceiver];
                if (senderSocketId || receiverSocketId) {
                    socket.to(receiverSocketId).emit('receive_video_call', { socketSender, callId, message });
                } else {
                    console.log('Sender or receiver not found');
                }
            });

            socket.on('send_audio_call', (data) => {
                const { socketSender, socketReceiver, callId, message } = data;
                const senderSocketId = memberTokens[socketSender];
                const receiverSocketId = memberTokens[socketReceiver];
                if (senderSocketId || receiverSocketId) {
                    socket.to(receiverSocketId).emit('receive_audio_call', { socketSender, callId, message });
                } else {
                    console.log('Sender or receiver not found');
                }
            });

            // socket.on('disconnect', (data) => {
            //     console.log('Disconnect event received:', data);
            //     const { isRefreshing } = data || {};

            //     if (!isRefreshing && !refreshing) {
            //         console.log('Socket Disconnected');
            //         userLeftTimeout = setTimeout(() => {
            //             if (!userLeft) {
            //                 handleDisconnect();
            //             }
            //             userLeft = false;
            //         }, 1000);
            //     } else if (isRefreshing) {
            //         console.log('Page Refresh Detected');
            //         refreshing = true;
            //         // Handle the refresh scenario as needed
            //         // For instance, prevent calling handleDisconnect()
            //     }
            // });

            socket.on('disconnect', () => {
                console.log("Socket Disconnected by default event");
                handleDisconnect(userToken); // Call handleDisconnect when disconnect occurs
            });

            // socket.on('userDisconnect', (elapsedTime) => {
            //     console.log("Socket Disconnected", elapsedTime);
            //     if (elapsedTime === 3) {
            //         handleDisconnect();
            //     }
            //     // Handle additional actions on userDisconnect event if needed
            // });

            // socket.on('refresh', () => {
            //     console.log('Refresh Detected');
            // });
        });
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
};

// const checkRefresh = () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const check = localStorage.getItem("senderToken");
//             resolve(check); // Resolve the promise with the value
//         }, 1000);
//     });
// };