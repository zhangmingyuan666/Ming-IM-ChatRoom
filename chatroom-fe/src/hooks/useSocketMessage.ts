import {WsTypes} from '@/types'
import {offMessage, onMessage} from '@/ws'
import {useEffect} from 'react'

const useSocketMessage = (name: WsTypes.IReceiveMessageType, callback?: any) => {
    useEffect(() => {
        const fn = (args: WsTypes.IWsResponse) => {
            callback(args)
        }
        onMessage(name, fn)
        return () => {
            offMessage(name)
        }
    }, [name, callback])  
}

export default useSocketMessage