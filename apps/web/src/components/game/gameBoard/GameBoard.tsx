export const GameBoard = ({children}:{children:React.ReactNode}) => {
    return(
        <div className=" h-full flex justify-center flex-col gap-4 text-4xl items-center">
            {children}
        </div>
    )
}