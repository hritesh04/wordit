type Player = {
    username:string;
    status:boolean;
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
    addRoom(roomId:string){
        this.games.set(roomId,{counter:0,started:false,players:[]})
        console.log(`created room ${roomId}`)
    }
    joinRoom(roomId:string,username:string){
        let room = this.games.get(roomId)!
        room.players.push({username,status:false})
        console.log(`${username} joined room ${roomId}`)
    }
    leaveRoom(roomId:string,username:string){
        let room = this.games.get(roomId)!
        room.players = room.players.filter((player)=>player.username!==username)
        if (room.players.length < 1){
            this.games.delete(roomId)
        }
        console.log(`${username} left room ${roomId}`)
    }
    next(roomId:string):string{
        console.log(this.games)
        let room = this.games.get(roomId)!
        room.counter++;
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
        room.players[playerIndex].status=ready
        console.dir(this.games,{depth:null})
    }
    startGame(roomId:string):boolean{
        const room = this.games.get(roomId)
        if(!room){
            return false
        }
        let count = 0;
        room.players.map((player)=>{
            if(player.status){
                count++
            }
        })
        if(count>room.players.length/2){
            room.started=true;
        }
        console.dir(this.games,{dept:null})
        return room.started
    }
}