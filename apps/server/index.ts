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

    // creating room
    socket.on("createRoom", (roomId) => {
        const game = GameManager.getInstance();
        game.addAndJoinRoom(roomId,socket.username)
        socket.join(roomId)
        socket.roomId=roomId
        socket.emit("info",`Room with id ${roomId} successfully created`)
        io.in(roomId).emit("roomEvents",`${socket.username} joined the room`)
    })

    // joining room
    socket.on("joinRoom",(roomId)=>{
        const rooms = io.sockets.adapter.rooms;
        if(rooms.has(roomId)){
            const game = GameManager.getInstance()
            game.joinRoom(roomId,socket.username)
            socket.join(roomId)
            socket.roomId=roomId
            socket.emit("info",`successfully joined room ${roomId}`)
            io.in(roomId).emit("roomEvents",`${socket.username} joined the room`)
        }else{
            socket.emit("erros",`unable to join room - ${roomId}`)
        }
    })

    // set user ready status
    socket.on("status",(status)=>{
        const game = GameManager.getInstance()
        game.setState(status,socket.roomId,socket.username)
        io.in(socket.roomId).emit("roomEvents",`${socket.username} is ${status ? "ready" : "not ready"}`)
    })

    // 
    socket.on("start",()=>{
        const game = GameManager.getInstance()
        const allPlayersReady = game.startGame(socket.roomId,socket.username)
        if(allPlayersReady){
            io.in(socket.roomId).emit("roomEvents","game will start in 5 seconds")
            setTimeout(()=>{
                let nextTurn = game.next(socket.roomId)
                io.in(socket.roomId).emit("roomEvents",`${nextTurn}'s turn`)
                io.in(socket.roomId).emit("turn",nextTurn)
                io.in(socket.roomId).emit("suffix", getSuffix(""))
            },5000)
        }else{
            io.in(socket.roomId).emit("roomEvents","all players are not ready")
        }
    })
    socket.on("guess",({word,suffix})=>{
        const isCorrect = checkWord(word)
        if(isCorrect){
            console.log("here")
            const game = GameManager.getInstance()
            const player = game.next(socket.roomId)
            io.in(socket.roomId).emit("roomEvents",`${player}'s turn`)
            io.in(socket.roomId).emit("turn",player)
            io.in(socket.roomId).emit("suffix",getSuffix(suffix))
        }else{
            io.in(socket.roomId).emit("roomEvents","Wrong Answer")
        }
    })
    socket.on("leaveRoom", (roomId) => {
        const game = GameManager.getInstance()
        game.leaveRoom(roomId,socket.username)
        socket.leave(roomId)
        io.in(roomId).emit("roomEvents",`${socket.username} left the room`)
    
    })
    socket.on("disconnect", ()=>{
        const game = GameManager.getInstance()
        game.leaveRoom(socket.roomId,socket.username)
        io.in(socket.roomId).emit("roomEvents",`${socket.username} left the room`)
        console.log("disconnected")
    })
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});