const { log } = require('console');
const express = require('express');
const http = require('http');

const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
});

let players = {};
io.on('connection', (socket)=>{
    console.log('New client connected: ', socket.id);
    players[socket.id] = {paddleY: 250, score:0};
    socket.on('disconnect', ()=>{
        console.log('Client disconnected: ', socket.id);
        delete players[socket.id];
        io.emit('players', players);
    });

    socket.on('paddleMove', (paddleY)=>{
        if(players[socket.id]){
            players[socket.id].paddleY = paddleY;
            io.emit('players', players);
        }
    })


    socket.on('socre', ()=>{
        if(players[socket.id]){
            players[socket.id].score+=1;
            io.emit('players', players);
        }
    })

    io.emit('players', players)
})



server.listen(3001, ()=>{console.log(`Server is listening on port 3001`);})