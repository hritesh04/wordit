import { useEffect, useState } from "react"
import { socket } from "../socket"
import { toast } from "sonner"
import { EventBox } from "../components/game/events/eventBox"
import { PlayersBox } from "../components/game/players/PlayersBox"
import { PlayerCard } from "../components/game/players/PlayerCard"
import { connectSocket } from "../utils/connectSocket"

interface Update {
    type:string;
    data:Player | string;
}

interface Player {
    username: string;
    status: boolean;
    leader: boolean;
}

interface Game {
    counter:number;
    started:boolean;
    players:Player[];
}

export const GamePage = () => {
    const[username,setUsername]=useState("")
    const [events,setEvents]=useState<string[]>([""])
    const [game,setGame]=useState<Game>();
    const [player,setPlayer]=useState<Player[]>([])
    console.log(game)
    console.log(player)
    useEffect(()=>{
        if(!socket.connected){
            connectSocket()
        }
        const handleRoomEvents = (msg:string)=>{
            setEvents((prev)=>[msg,...prev])
        }
        const handleGameState = (msg:Game)=>{
            setGame(msg)
            setPlayer(msg.players)
        }
        const handleUpdate = (msg:Update) => {
            const {type,data} = msg;
            switch (type){
                case "join" :
                    if(typeof data !== "object")
                        return
                    setGame((prev)=>{
                        if(!prev)
                            return prev
                        return {...prev, players: [...prev.players, data as Player]}
                    })
                    setPlayer((prev)=>[...prev,data as Player])
                    break
                case "left" :
                    if(typeof data !== "object")
                        return
                    setGame((prev)=> {
                        if(!prev)
                            return prev
                        return {...prev,players:[...prev.players.filter((p)=>p.username !== data.username)]}
                    })
                    setPlayer((prev)=>[...prev.filter((p)=>p.username!== data.username)])
                    break
            }
        }
        socket.on("roomEvents",handleRoomEvents)
        socket.on("update",handleUpdate)
        socket.emit("state","room1")
        socket.on("turn",()=>{})
        socket.on("suffix",()=>{})
        socket.on("state",handleGameState)

        return ()=>{
            socket.off("roomEvents",handleRoomEvents)
            socket.off("turn")
            socket.off("suffix")
            socket.emit("leaveRoom",)
        };
    },[])
    
    return(
        <div className=" grid grid-cols-4 h-full">
            <div className=" col-span-3">
            </div>
            <div className=" col-span-1 h-full gap-2">
                <div className="h-1/4 overflow-hidden flex flex-wrap p-2">
                <PlayersBox>
                    {player.map((p)=> <PlayerCard key={p.username} name={p.username}/>)}
                </PlayersBox>
                </div>
                <div className="h-1/2 overflow-clip">
                <EventBox events={events}/>
                </div>
                <div className=" h-1/4"></div>
            </div>
        </div>
    )
}