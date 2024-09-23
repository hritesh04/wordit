import { ReactTyped } from "react-typed"
import { Banner } from "../components/landing/Banner"
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectSocket } from "../utils/connectSocket";
import { socket } from "../socket";
export const LandingPage = () => {
    useEffect(() => {
        if (!socket.connected) {
            connectSocket().catch((error) => {
                console.error("Socket connection error:", error);
            });
        }

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
        };
    }, []);

    return(
        <>
            <Banner>
                <div className="flex justify-end">
                <ReactTyped
                    strings={["sta","attrac","celebra"]}
                    typeSpeed={50}
                    backSpeed={70}
                    loop
                    cursorChar=""
                    />
                </div>
            </Banner>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}