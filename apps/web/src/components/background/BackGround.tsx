import { Outlet } from "react-router-dom"
import Starfield from "react-starfield"
export const BackGround = (
) => {
    return(
        <>
        <Starfield 
        starCount={1000}
        starColor={[255, 255, 255]}
        speedFactor={0.04}
        backgroundColor="black"
        />
        <div className="h-full">
            <Outlet />
        </div>
        </>
    )
}