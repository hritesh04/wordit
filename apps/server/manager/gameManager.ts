type Player = {
    username:string;
    status:boolean;
    leader:boolean;
}
export class GameManager {
    private static instance:GameManager;
    private games:Map<string,{counter:number,started:boolean,players:Player[]}>
    private constructor(){
        this.games=new Map<string,{counter:number, started:boolean ,players:Player[]}>();
    }
    static getInstance(){
        if(!this.instance){
            this.instance = new GameManager();
        }
        return this.instance
    }
    addAndJoinRoom(roomId:string,username:string){
        this.games.set(roomId,{counter:0,started:false,players:[{username,status:true,leader:true}]})
        console.log(`created room ${roomId}`)
        console.dir(this.games,{dept:null})
    }
    joinRoom(roomId:string,username:string){
        const room = this.games.get(roomId)!
        room.players.push({username,status:false,leader:false})
        console.log(`${username} joined room ${roomId}`)
        console.dir(this.games,{dept:null})
    }
    leaveRoom(roomId:string,username:string){
        const room = this.games.get(roomId)!
        if (room.players.length <= 1 && room.players[0].username === username){
            this.games.delete(roomId)
            return
        }
        const playerIndex = room.players.findIndex((p)=>p.username===username)
        if(room.players[playerIndex].leader){
            if(playerIndex != room.players.length-1){
                room.players[playerIndex+1].leader = true;
            }else{
                room.players[playerIndex-1].leader=true;
            }
        }
        room.players = room.players.filter((player)=>player.username!==username)
        console.log(`${username} left room ${roomId}`)
        console.dir(this.games,{dept:null})
    }
    next(roomId:string):string{
        const room = this.games.get(roomId)!
        room.counter++;
        console.dir(this.games,{dept:null})
        return room.players[room.counter%room.players.length].username
    }
    setState(ready:boolean,roomId:string,username:string){
        const room = this.games.get(roomId)
        if(!room){
            return
        }
        const playerIndex = room.players.findIndex(player => player.username===username)
        if(playerIndex===-1){
            return
        }
        room.players[playerIndex].status=!room.players[playerIndex].status
        console.dir(this.games,{depth:null})
    }
    startGame(roomId:string,username:string):boolean{
        const room = this.games.get(roomId)
        if(!room){
            return false
        }
        const playerIndex = room.players.findIndex((player)=>player.username===username && player.leader===true)
        if(playerIndex === -1){
            return false
        }
        let count = 0;
        room.players.map((player)=>{
            if(player.status){
                count++
            }
        })
        if(count>=room.players.length/2){
            room.started=true;
        }
        console.dir(this.games,{dept:null})
        return room.started
    }
}