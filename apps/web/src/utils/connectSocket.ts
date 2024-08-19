import { socket } from "../socket";
export function connectSocket(){
    socket.connect()
    if(!socket.connected){
        console.log("falied")
        return true
    }
    return false
    console.log("success")
}