import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { connectSocket } from "../../utils/connectSocket";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export const RoomCard = () => {
    const [select, setSelect] = useState("");
    const [roomId,setRoomId] =useState("");
    const [name,setName]=useState("");
    const naviagte = useNavigate();

    const handleCancel = () => {
        setSelect("");
    };

    
    const handleCreateRoom = () => {
        if(!roomId){
            toast.error("RoomID is empty")
            return
        }
        let isConnected = socket.connected
        if(!isConnected){
            const success = connectSocket()
            if(!success){
                toast.error("unable to connect socket")
                return
            }
        }
        socket.emit("createRoom",roomId)
    }
    
    const handleJoinRoom = () =>{
        if(!roomId){
            toast.error("RoomID is empty")
            return
        }
        let isConnected = socket.connected
        if(!isConnected){
            const success = connectSocket()
            if(!success){
                toast.error("unable to connect socket")
                return
            }
        }
        socket.emit("joinRoom",roomId)
    }
    
    useEffect(()=>{
        const handleErrorEvents = (msg:string) => {
            toast.error(msg)
        } 
        const handleRedirects = (msg:string)=>{
            naviagte(msg)
        }
        const handleInfoEvents = (msg:string)=>{
            toast.info(msg)
        }
        const handleName = (msg:string) => {
            setName(msg)
        }
        socket.on("errors",handleErrorEvents)
        socket.on("name",handleName)
        socket.on("redirects",handleRedirects)
        socket.on("info",handleInfoEvents)

        return ()=>{
            socket.off("info",handleInfoEvents)
            socket.off("redirects",handleRedirects)
            socket.off("error",handleErrorEvents)
        }
    },[])

    return (
        <div className="flex w-full gap-8 justify-evenly">
            {
                select === "" || select === "create" ?
                (
                    select === "create" ?
                    <div className=" flex space-x-2 justify-center">
                    <input
                        type="text"
                        placeholder="Enter room name"
                        className="bg-white bg-opacity-15 rounded-md p-2 px-4 w-[50%]"
                        onChange={(e)=>setRoomId(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white rounded-md p-2 px-4"
                            onClick={handleCreateRoom}
                        >
                            create
                        </button>
                        <button
                            className="bg-red-500 text-white rounded-md p-2 px-4"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        </div>
                    :
                    <button
                        className="bg-white bg-opacity-15 rounded-md p-2 px-4"
                        onClick={() => setSelect("create")}
                    >
                        Create a Room
                    </button>
                ) : null
            }
            {
                select === "" || select === "join" ?
                (
                    select === "join" ?
                    <div className="flex space-x-2 justify-center">
                        <input
                            type="text"
                            placeholder="Enter room ID"
                            className="bg-white bg-opacity-15 rounded-md p-2 px-4 w-[50%]"
                            onChange={(e)=>setRoomId(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white rounded-md p-2 px-4"
                            onClick={handleJoinRoom}
                        >
                            Join
                        </button>
                        <button
                            className="bg-red-500 text-white rounded-md p-2 px-4"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                    :
                    <button
                        className="bg-white bg-opacity-15 rounded-md p-2 px-4"
                        onClick={() => setSelect("join")}
                    >
                        Join a Room
                    </button>
                ) : null
            }
        </div>
    );
};
