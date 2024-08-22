import { socket } from "../socket";
export function connectSocket(){
    socket.connect()
    if(!socket.connected){
        return true
    }
    return false
}