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
    joinRoom(roomId:string,username:string):boolean{
        const room = this.games.get(roomId)!
        if(room.started)
            return false
        room.players.push({username,status:false,leader:false})
        console.log(`${username} joined room ${roomId}`)
        return true
    }
    leaveRoom(roomId:string,username:string){
        const room = this.games.get(roomId)
        if(!room){
            return
        }
        if (room.players.length <= 1 && room.players[0].username === username){
            this.games.delete(roomId)
            return
        }
        const playerIndex = room.players.findIndex((p)=>p.username===username)
        if(playerIndex === -1){
            return
        }
        if(room.players[playerIndex].leader){
            if(playerIndex != room.players.length-1){
                room.players[playerIndex+1].leader = true;
                room.players[playerIndex+1].status = true;

            }else{
                room.players[playerIndex-1].leader=true;
                room.players[playerIndex-1].status = true;

            }
        }
        if(room.players.length <= 1)
            room.started=false
        room.players = room.players.filter((player)=>player.username!==username)
    }
    next(roomId:string):string{
        const room = this.games.get(roomId)!
        room.counter++;
        console.dir(this.games,{dept:null})
        return room.players[room.counter%room.players.length].username
    }
    getGameState(roomId:string){
        const room = this.games.get(roomId)
        if(!room){
            return
        }
        return room
    }
    setState(roomId:string,username:string):boolean{
        const room = this.games.get(roomId)
        if(!room){
            return false
        }
        const playerIndex = room.players.findIndex(player => player.username===username)
        if(playerIndex===-1){
            return false
        }
        room.players[playerIndex].status=!room.players[playerIndex].status
        return room.players[playerIndex].status
    }
    startGame(roomId:string,username:string):boolean{
        const room = this.games.get(roomId)
        if(!room){
            return false
        }
        if(room.players.length <=1)
            return false
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
    getLeader(roomId:string):Player | void{
        const room = this.games.get(roomId)
        if(!room)
            return 
        const leaderIndex = room.players.findIndex((p)=>p.leader===true)
        if(leaderIndex === -1)
            return
        return room.players[leaderIndex]
    }
}