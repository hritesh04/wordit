export const PlayerCard = ({name,status}:{name:string,status:boolean}) => {
    console.log(name,status)
    return (
        <div className={`flex items-center justify-center border rounded-lg flex-grow flex-shrink ${status ? "border-green-500":"border-red-500"}`}>
            <p className="text-xl min-w-28 text-center">{name}</p>
        </div>
    )
}