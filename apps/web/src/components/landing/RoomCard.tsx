import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { connectSocket } from "../../utils/connectSocket";
import { Route, useNavigate } from "react-router-dom";
export const RoomCard = () => {
    const [select, setSelect] = useState("");
    const [roomId,setRoomId] =useState("");
    const [username,setUsername] = useState("");
    const naviagte = useNavigate();

    const handleCancel = () => {
        setSelect("");
    };

    
    const handleCreateRoom = () => {
        if(!roomId){
            console.log("Empty RoomId")
            return
        }
        let isConnected = socket.connected
        if(!isConnected){
            const success = connectSocket()
            if(!success){
                console.log("unable to connect socket")
                return
            }
        }
        socket.emit("createRoom",roomId)
        naviagte(`/${username}/${roomId}`)
    }

    useEffect(()=>{

        const handleUsername = (name:string) => {
            setUsername(name)
        }

        const handleInfoEvents = (msg:string) => {
            console.log(msg)
        }

        const handleErrorEvents = (msg:string) => {
            console.log(msg)
        } 
        socket.on("name",handleUsername)
        socket.on("info",handleInfoEvents)
        socket.on("errors",handleErrorEvents)
        return ()=>{
            socket.off("name")
            socket.off("info")
            socket.off("errors")
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
                        />
                        <button
                            className="bg-green-500 text-white rounded-md p-2 px-4"
                            onClick={() => alert("Joining room...")}
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
