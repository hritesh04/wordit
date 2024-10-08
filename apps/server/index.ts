import * as dotenv from "dotenv";
dotenv.config()
import { Server } from 'socket.io';
import {createServer} from "node:http";
import { getUserName } from './utils/username';
import { checkWord, getSuffix } from './utils/spellCheck';
import { GameManager } from './manager/gameManager';

const server = createServer()
const io = new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
    },
});
io.on("connection",(socket) => {
    socket.username = getUserName()
    socket.emit("name",socket.username)

    // creating room
    socket.on("createRoom", (roomId) => {
        const game = GameManager.getInstance();
        socket.join(roomId)
        socket.roomId=roomId
        // creates room and adds player
        game.addAndJoinRoom(roomId,socket.username)
        socket.emit("info",`Room with id ${roomId} successfully created`)
        socket.emit("redirects",`${socket.username}/${roomId}`)
        io.in(roomId).emit("roomEvents",`${socket.username} joined the room`)
    })

    // joining room
    socket.on("joinRoom",(roomId)=>{
        const rooms = io.sockets.adapter.rooms;
        if(socket.roomId){
            return
        }
        if(rooms && rooms.get(roomId)){
            const game = GameManager.getInstance()
            // join room
            const success = game.joinRoom(roomId,socket.username)
            if(!success){
                socket.emit("errors","Game already started")
                return
            }
            socket.join(roomId)
            socket.roomId=roomId
            socket.emit("info",`successfully joined room ${roomId}`)
            socket.emit("redirects",`${socket.username}/${roomId}`)
            io.in(roomId).emit("roomEvents",`${socket.username} joined the room`)
            // new player joined update
            socket.broadcast.to(roomId).emit("update",{type:"join",data:{username:socket.username,status:false,leader:false,lives:3}})
        }else{
            socket.emit("errors",`unable to join room - ${roomId}`)
        }
    })

    // set user ready status
    socket.on("status",()=>{
        const game = GameManager.getInstance()
        const status = game.setState(socket.roomId,socket.username)
        io.in(socket.roomId).emit("roomEvents",`${socket.username} is ${status ? "ready" : "not ready"}`)
        socket.broadcast.to(socket.roomId).emit("update",{type:"status",data:{username:socket.username,status,leader:false}})
    })

    // start game
    socket.on("start",()=>{
        const game = GameManager.getInstance()
        const allPlayersReady = game.startGame(socket.roomId,socket.username)
        if(allPlayersReady){
            io.in(socket.roomId).emit("roomEvents","game will start in 5 seconds")
            io.in(socket.roomId).emit("update",{type:"start",data:"Game Starting in 5 seconds"})
            setTimeout(()=>{
                const nextTurn = game.next(socket.roomId)
                io.in(socket.roomId).emit("roomEvents",`${nextTurn}'s turn`)
                io.in(socket.roomId).emit("turn",nextTurn)
                io.in(socket.roomId).emit("suffix", getSuffix(""))
                },5000)
        }else{
            socket.emit("msg","Players not ready")
            io.in(socket.roomId).emit("roomEvents","all players are not ready")
        }
    })

    // returns game state
    socket.on("state", ()=>{
        const roomPool = io.sockets.adapter.rooms;
        if(!roomPool.has(socket.roomId)){
            return {}
        }
        const game = GameManager.getInstance();
        const room = game.getGameState(socket.roomId)
        socket.emit("state",room)
    })

    // guess if the word is correct
    socket.on("guess",({word,suffix})=>{
        // socket.broadcast.in(socket.roomId).emit("update",{type:"guess",data:word})
        const isCorrect = checkWord(word+suffix)
        const game = GameManager.getInstance()
        if(!isCorrect){
            game.reduceLive(socket.roomId,socket.username)
            const room = game.getGameState(socket.roomId)
            if(!room){
                return
            }
            if(room.players.length === 1){
                io.in(socket.roomId).emit("roomEvents",`The Winner is ${room.players[0].username}`)
                io.in(socket.roomId).emit("update",{type:"winner",data:room.players[0].username})
                io.in(socket.roomId).emit("state",room)
                socket.leave(socket.roomId)
            }else{
                const player = game.next(socket.roomId)
                io.in(socket.roomId).emit("roomEvents","Wrong Answer")
                io.in(socket.roomId).emit("turn",player)
                io.in(socket.roomId).emit("suffix",getSuffix(suffix))    
                io.in(socket.roomId).emit("state",room)
            }
        }else{
            const player = game.next(socket.roomId)
            io.in(socket.roomId).emit("turn",player)
            io.in(socket.roomId).emit("suffix",getSuffix(suffix))    
        }
    })

    // leave room
    socket.on("leaveRoom", (turn) => {
        const game = GameManager.getInstance()
        game.leaveRoom(socket.roomId,socket.username)
        socket.leave(socket.roomId)
        io.in(socket.roomId).emit("roomEvents",`${socket.username} left the room`)
        const newLeader = game.getLeader(socket.roomId)
        socket.broadcast.to(socket.roomId).emit("update",{type:"left",data:{username:socket.username,status:false,leader:false}})
        if(newLeader){
            io.to(socket.roomId).emit("update",{type:"leader",data:{username:newLeader.username,status:newLeader.status,leader:newLeader.leader}})
        }
        const gameState = game.getGameState(socket.roomId)
        if(!gameState){
            return
        }
        if(gameState.players.length <= 1){
            io.to(socket.roomId).emit("update",{type:"stop",data:"not enough player"})
            io.to(socket.roomId).emit("state",gameState)
        }
        if(gameState.started && turn){
            const nextTurn = game.next(socket.roomId)
            io.in(socket.roomId).emit("roomEvents",`${nextTurn}'s turn`)
            io.in(socket.roomId).emit("turn",nextTurn)
            io.in(socket.roomId).emit("suffix", getSuffix(""))
        }
    })

    // disconnect socket
    socket.on("disconnect", ()=>{
        const game = GameManager.getInstance()
        game.leaveRoom(socket.roomId,socket.username)
        socket.leave(socket.roomId)
        io.in(socket.roomId).emit("roomEvents",`${socket.username} left the room`)
        const gameState = game.getGameState(socket.roomId)
        if(!gameState){
            return
        }
        if(gameState.started === true && gameState.players.length <= 1){
            io.to(socket.roomId).emit("update",{type:"stop",data:"not enough player"})
        }
        const newLeader = game.getLeader(socket.roomId)
        socket.broadcast.to(socket.roomId).emit("update",{type:"left",data:{username:socket.username,status:false,leader:false}})
        if(newLeader){
            io.to(socket.roomId).emit("update",{type:"leader",data:{username:newLeader.username,status:newLeader.status,leader:newLeader.leader}})
        }
    })
})

server.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});