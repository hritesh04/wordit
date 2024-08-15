import { Server } from 'socket.io';
import {createServer} from "node:http";
import { getUserName } from './utils/username';
import { checkWord, getSuffix } from './utils/spellCheck';
import { GameManager } from './manager/gameManager';

const server = createServer()
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
    },
});

io.on("connection",(socket) => {
    socket.username = getUserName()
    socket.emit("name",socket.username)
    socket.on("createRoom", (roomId) => {
        const game = GameManager.getInstance();
        game.addRoom(roomId)
        game.joinRoom(roomId,socket.username)
        socket.join(roomId)
        io.in(roomId).emit("new",`${socket.username} joined the room`)
    })
    socket.on("joinRoom",(roomId)=>{
        const rooms = io.sockets.adapter.rooms;
        if(rooms.has(roomId)){
            const game = GameManager.getInstance()
            game.joinRoom(roomId,socket.username)
            socket.join(roomId)
            io.in(roomId).emit("new",`${socket.username} joined the room`)
        }else{
            socket.emit("errors","Invalid roomId")
        }
    })
    socket.on("status",({status,roomId})=>{
        const game = GameManager.getInstance()
        game.setState(status,roomId,socket.username)
    })
    socket.on("start",(roomId)=>{
        const game = GameManager.getInstance()
        const allPlayersReady = game.startGame(roomId)
        if(allPlayersReady){
            io.in(roomId).emit("start","game will start in 5 seconds")
            setTimeout(()=>{
                io.in(roomId).emit("turn",game.next(roomId))
                io.in(roomId).emit("suffix", getSuffix(""))
            },5000)
        }
    })
    socket.on("guess",({word,roomId})=>{
        const isCorrect = checkWord(word)
        if(isCorrect){
            const game = GameManager.getInstance()
            const player = game.next(roomId)
            socket.in(roomId).emit("new",`${player}'s chance`)
            socket.in(roomId).emit("turn",player)
        }
    })
    socket.on("leaveRoom", (roomId) => {
        const game = GameManager.getInstance()
        game.leaveRoom(roomId,socket.username)
        socket.leave(roomId)
        io.in(roomId).emit("new",`${socket.username} left the room`)
    
    })
    socket.on("disconnect", ()=>{
        console.log("disconnected")
    })
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});