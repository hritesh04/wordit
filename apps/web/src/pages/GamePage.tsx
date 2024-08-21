import { useEffect, useState } from "react"
import { socket } from "../socket"
import { toast } from "sonner"
import { EventBox } from "../components/game/events/eventBox"
import { PlayersBox } from "../components/game/players/PlayersBox"
import { PlayerCard } from "../components/game/players/PlayerCard"
import { connectSocket } from "../utils/connectSocket"
import { StatusButton } from "../components/game/statusButton/statusButton"
import { useNavigate, useParams } from "react-router-dom"

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
    const [events,setEvents]=useState<string[]>([""])
    const [game,setGame]=useState<Game>();
    const [player,setPlayer]=useState<Player[]>([])
    const [status,setStatus]=useState(false);
    const [isLeader,setIsLeader]=useState(false);
    const navigate = useNavigate()
    const {name} = useParams();

    const handleReadyStatus = () => {
        if(isLeader){
            socket.emit("start")
        }
        setStatus(!status)
        socket.emit("status")
        setPlayer((prev) => {
            return prev.map((p) =>
                p.username === name
                    ? { ...p, status:!status }
                    : p
            );
        });
    }
    const handleExitRoom = () => {
        socket.emit("leaveRoom")
        navigate("/")
    }
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
            const isCreater = msg.players.filter((p)=>p.username===name && p.leader===true)
            console.log(isCreater)
            if(isCreater.length !== 0){
                setIsLeader(true)
                setStatus(true)
            }
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
                case "status" :
                    if(typeof data !== "object")
                        return
                    console.log("Update")
                    setPlayer((prev) => {
                        return prev.map((p) =>
                            p.username === (data as Player).username
                                ? { ...p, status: (data as Player).status }
                                : p
                        );
                    });
                    break
            }
        }
        socket.on("roomEvents",handleRoomEvents)
        socket.on("update",handleUpdate)
        socket.emit("state")
        socket.on("turn",()=>{})
        socket.on("suffix",()=>{})
        socket.on("state",handleGameState)

        return ()=>{
            socket.off("roomEvents",handleRoomEvents)
            socket.off("update",handleUpdate)
            socket.off("state",handleGameState)
            socket.off("turn")
            socket.off("suffix")
            socket.emit("leaveRoom")
        };
    },[])
    
    return(
        <div className=" grid grid-cols-4 h-full max-h-screen overflow-hidden">
            <div className="h-full col-span-3">
            </div>
            <div className="h-full overflow-hidden col-span-1 gap-2 flex flex-col">
                <div className="overflow-auto h-1/4 flex flex-wrap p-2">
                <PlayersBox>
                    {player.map((p)=> <PlayerCard key={p.username} name={p.username} status={p.status}/>)}
                </PlayersBox>
                </div>
                <EventBox events={events}/>
                <div className="flex-none">
                    <StatusButton>
                        <button className={`rounded-md p-8 w-full ${status || isLeader ? "bg-red-600" : "bg-green-500"}`}
                        onClick={handleReadyStatus}>
                            {status && isLeader ? "Start" : status ? "Cancel" :" Ready"}
                        </button>
                        <button className="p-8 rounded-md w-full bg-slate-500"
                            onClick={handleExitRoom}
                        >
                            Exit Room
                        </button>
                    </StatusButton>
                </div>
            </div>
        </div>
    )
}