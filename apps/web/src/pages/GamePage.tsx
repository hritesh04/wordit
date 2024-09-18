import { useEffect, useState } from "react"
import { socket } from "../socket"
import { EventBox } from "../components/game/events/eventBox"
import { PlayersBox } from "../components/game/players/PlayersBox"
import { PlayerCard } from "../components/game/players/PlayerCard"
import { connectSocket } from "../utils/connectSocket"
import { StatusButton } from "../components/game/statusButton/statusButton"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { GameBoard } from "../components/game/gameBoard/GameBoard"

interface Update {
    type:string;
    data:Player | string;
}

interface Player {
    username: string;
    status: boolean;
    leader: boolean;
    lives:number;
}

interface Game {
    counter:number;
    started:boolean;
    players:Player[];
}

export const GamePage = () => {
    const [events,setEvents]=useState<string[]>([""])
    const [player,setPlayer]=useState<Player[]>([])
    const [gameState,setGameState]=useState(false);
    const [status,setStatus]=useState(false);
    const [isLeader,setIsLeader]=useState(false);
    const [turn,setTurn]=useState("");
    const [suffix,setSuffix] = useState("");
    const [guess,setGuess]= useState("");
    const navigate = useNavigate()
    const {name,roomId} = useParams();
    const[username,setUsername]=useState(name)

    const handleReadyStatus = () => {
        if(isLeader){
            socket.emit("start")
        }else{
            setStatus(!status)
            socket.emit("status")
            setPlayer((prev) => {
                return prev.map((p) =>
                    p.username === username
                ? { ...p, status:!status }
                : p
            );
        });
    }
    }
    const handleExitRoom = () => {
        socket.emit("leaveRoom")
        navigate("/")
    }
    const handleSubmitGuess = () => {
        socket.emit("guess",{word:guess,suffix})
        setGuess("")
    }
    useEffect(()=>{
        if(!socket.connected){
            connectSocket()
            socket.emit("joinRoom",roomId)
        }
        socket.emit("state")
        const handleRoomEvents = (msg:string)=>{
            setEvents((prev)=>[msg,...prev])
        }
        const handleGameState = (msg:Game)=>{
            setPlayer(msg.players)
            setGameState(msg.started)
            const isCreater = msg.players.filter((p)=>p.username===username && p.leader===true)
            console.log(msg)
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
                    setPlayer((prev)=>[...prev,data as Player])
                    break
                case "left" :
                    if(typeof data !== "object")
                        return
                    setPlayer((prev)=>[...prev.filter((p)=>p.username!== data.username)])
                    break
                case "status" :
                    if(typeof data !== "object")
                        return
                    setPlayer((prev) => {
                        return prev.map((p) =>
                            p.username === (data as Player).username
                        ? { ...p, status: (data as Player).status }
                                : p
                        );
                    });
                    break
                case "start" :
                    if(typeof data !== "string")
                        return
                    toast.info(data)
                    let i = 4
                    setInterval(()=>{
                        if(i===0){
                            setGameState(true)
                            return
                        }
                        toast.info(i)
                        i--
                    },1000)
                    break
                case "stop":
                    if(typeof data !== "string")
                        return
                    setGameState(false)
                    toast.info(`Game stopped : ${data}`)
                    break
                case "guess":
                    if(typeof data !== "string")
                        return
                    setGuess(data)
                    break
                case "leader":
                    if(typeof data !== "object")
                        return
                    if(data.username===username){
                        setIsLeader(data.leader)
                        setStatus(data.status)
                        setPlayer((prev)=>{
                            return prev.map((p) =>
                                p.username === (data as Player).username
                                    ? { ...p, status: (data as Player).status }
                                    : p
                            );
                        })
                    }
                    break
                }
            }
        const handleTurn = (msg:string) => {
            setTurn(msg)
        }
        const handleSuffix = (msg:string) => {
            setSuffix(msg)
        }
        socket.on("roomEvents",handleRoomEvents)
        socket.on("update",handleUpdate)
        socket.on("name",(data)=>{
            setUsername(data)
        })
        socket.on("turn",handleTurn)
        socket.on("suffix",handleSuffix)
        socket.on("state",handleGameState)

        return ()=>{
            socket.off("roomEvents",handleRoomEvents)
            socket.off("update",handleUpdate)
            socket.off("state",handleGameState)
            socket.off("turn",handleTurn)
            socket.off("suffix")
            socket.disconnect()
        };
    },[])
    
    return(
        <div className="h-full grid grid-rows-5 max-h-screen md:flex overflow-hidden">
            <div className="h-full md:w-9/12 row-span-3">
                <GameBoard>
                    {
                        gameState && 
                        <>
                            <div>{turn} is Playing</div>
                            {turn === username ? 
                            <div className=" flex items-center gap-4">
                                <div>
                                <input className="bg-transparent border-b text-end w-40 focus:outline-none text-white" onChange={(e)=>setGuess(e.target.value)}/>{suffix}
                                </div>
                                <button className="p-4 rounded-md bg-white/20 backdrop-blur-md shadow-lg shadow-white/10 text-white hover:bg-white/30 transition-all duration-200"
                                onClick={handleSubmitGuess}
                                >Submit</button>
                            </div>
                            :
                            <div className=" flex items-center gap-4">
                                    <div className=" min-w-28 border-b text-end">{guess+suffix}</div>
                            </div>    
                            }
                        </>
                    }
                </GameBoard>
            </div>
            <div className="h-full overflow-hidden row-span-2 md:w-3/12 gap-2 flex flex-col-reverse">
                <div className="overflow-auto order-1 h-1/4 flex flex-wrap p-2 md:order-2">
                <PlayersBox>
                    {player.map((p)=> <PlayerCard key={p.username} state={gameState} player={p} turn={turn}/>)}
                </PlayersBox>
                </div>
                <EventBox events={events}/>
                <div className="flex-none">
                    <StatusButton>
                        {
                            !gameState &&
                            <button className={`rounded-md p-8 w-full ${status || isLeader ? "bg-red-600" : "bg-green-500"}`}
                            onClick={handleReadyStatus}>
                            {status && isLeader ? "Start" : status ? "Cancel" :" Ready"}
                        </button>
                        }
                        <button className={`p-8 rounded-md w-full ${gameState ? "bg-red-600" : "bg-slate-500"}`}
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