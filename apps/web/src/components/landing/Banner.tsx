import { RoomCard } from "./RoomCard"

export const Banner = ({children}:{children:React.ReactNode}) => {
    return(
        <div className="flex flex-col justify-center items-center h-3/4">
            <div className="w-full flex flex-col items-center">
                <div className="h-fit w-fit">
                    <h1 className="text-9xl">WORDIT</h1>
                    <div className="grid grid-cols-2 text-4xl -mt-4">
                        {children}
                        <span className=" grid-cols-2 underline">tion</span>
                    </div>
                </div>
                <div className="mt-8 w-fit text-2xl">
                    <RoomCard />
                </div>
            </div>
        </div>
    )
}