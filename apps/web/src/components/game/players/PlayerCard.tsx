interface Player {
    username: string;
    status: boolean;
    leader: boolean;
    lives:number;
}

export const PlayerCard = ({player,state,turn=""}:{player:Player,state:boolean,turn?:string}) => {
    const borderClass = state
    ? (turn === player.username ? "border" : "border-transparent") 
    : (player.status ? "border-green-500" : "border-red-500");

    return (
        <div className={`flex flex-col items-center justify-center border rounded-lg flex-grow flex-shrink 
        ${borderClass}`}>
            <p className="text-xl min-w-28 text-center">{player.username}</p>
            <div className=" w-fit flex flex-row gap-2">
            {[...Array(player.lives)].map((_,key)=>{
                return <svg viewBox="-0.32 -0.32 16.64 16.64" fill="none" xmlns="http://www.w3.org/2000/svg" key={key} stroke="#ff0000" strokeWidth="0.00016" className=" w-5 h-5"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.544"></g><g id="SVGRepo_iconCarrier"> <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#ff0000"></path> </g></svg>
            })}
            </div>
        </div>
    )
}