export const PlayersBox = ({children}:{children:React.ReactNode}) => {
    return (
        <div className="flex gap-1 overflow-auto max-h-full flex-wrap grow shrink">
            {children}
        </div>
    )
}