import { socket } from "../socket";
import { toast } from "react-toastify";

export function connectSocket() {
    const toastId = toast.loading("Starting server, please wait...");

    return new Promise((resolve) => {
        socket.connect();

        socket.on("connect", () => {
            toast.update(toastId, { render: "Connected to the server!", type: "success", isLoading: false, autoClose: 2000, closeOnClick: true,draggable: true, theme: "dark"});
            resolve(true);
        });
    });
}