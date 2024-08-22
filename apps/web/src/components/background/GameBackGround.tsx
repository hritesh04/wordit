import { Outlet } from "react-router-dom"
import Textbg from "../game/textAnimationBg"
import { setChar } from "../game/textAnimationBg"
export const GameBackGround = () => {

    setTimeout(()=>{
        let char = "abcdefghijklmnopqrstuvwxyz"
        setChar(prev => [...prev, ...char.split('')])
    },1000)

    return(
        <>
            <Textbg 
                starColor={[255, 255, 255]}
                speedFactor={0.07}
                backgroundColor="black"
                />
            <div className=" h-full">
             <Outlet />
            </div>
        </>
    )
}