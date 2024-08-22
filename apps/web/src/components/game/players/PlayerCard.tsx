export const PlayerCard = ({name,status,state=false,turn=""}:{name:string,status:boolean,state:boolean,turn?:string}) => {
    const borderClass = state 
    ? (turn === name ? "border" : "border-transparent") 
    : (status ? "border-green-500" : "border-red-500");

    return (
        <div className={`flex items-center justify-center border rounded-lg flex-grow flex-shrink 
        ${borderClass}`}>
            <p className="text-xl min-w-28 text-center">{name}</p>
        </div>
    )
}