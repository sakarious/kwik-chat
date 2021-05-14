const app = require('express')()
const http = require('http').createServer(app)
const { Socket } = require('dgram')
const socketio = require('socket.io')
const io = socketio(http, {
    cors: {
        origin: '*',
    }
})
const {addUser, removeUser, getUser} = require('./helper')
const PORT = process.env.PORT || 5000

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('create-room', name => {
        console.log('The room name receive is ', name);
    })
    socket.on('join', ({name, room_id, user_id}) => {
        const {error, user} = addUser({
            socket_id: socket.id,
            name,
            room_id,
            user_id
        })
        if(error) {
            console.log('join-error', error);
        } else {
            console.log('join-user', user);
        }
    })
    socket.on('sendMessage', (message, room_id, callback) => {
        const user = getUser(socket.id)
        const msgToStore = {
            name: user.name,
            user_id: user.user_id,
            room_id,
            text: message
        }
        console.log('message', msgToStore);
        io.to(room_id).emit('message', msgToStore)
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
    })
})

http.listen(5000, () => {
    console.log(`Listening on ${PORT}`);
})