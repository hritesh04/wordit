export const EventBox = ({events}:{events:string[]}) => {
    return (
        <div className="h-full flex overflow-auto flex-col-reverse p-4 fade justify-center">
            {events.map((event,i)=>{
                return (
                    <p key={i} className=" text-center">
                        {event}
                    </p>
                )
            })}
        </div>
    )
}