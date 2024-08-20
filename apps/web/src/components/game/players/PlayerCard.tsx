export const PlayerCard = ({name}:{name:string}) => {
    return (
        <div className="flex items-center justify-center border rounded-lg flex-grow flex-shrink">
            <p className="text-xl min-w-28 text-center">{name}</p>
        </div>
    )
}