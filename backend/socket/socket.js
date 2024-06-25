import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import { Socket } from 'dgram';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const userScoketMap = {}
io.on('connection', (socket) => {
    console.log("User connected", socket.id);
    const userId = socket.handshake.query.userId;

    if(userId != "undefined") userScoketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userScoketMap));
    
    
    socket.on("disconnect", ()=>{
        console.log("User disconnected");
        delete userScoketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userScoketMap));

    })
})



export {io, server,app}