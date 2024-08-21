export const EventBox = ({events}:{events:string[]}) => {
    return (
        <div className="flex-1 overflow-auto flex flex-col-reverse fade items-center pb-10">
            {events.map((event,i)=>{
                return (
                    <p key={i} className=" text-md text-center">
                        {event}
                    </p>
                )
            })}
        </div>
    )
}