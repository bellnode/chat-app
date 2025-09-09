import { useEffect } from "react"

const useSocketEventHandler = (socket,handlers)=>{
    useEffect(()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
            socket.on(event,handler)
            // console.log('An event occured')
            // console.log({event})
        })

        return ()=>{
            Object.entries(handlers).forEach(([event,handler])=>{
                socket.off(event,handler)
            })
        }
    },[])
}

export {useSocketEventHandler}