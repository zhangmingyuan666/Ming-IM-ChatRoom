import styled from 'styled-components'
import { Button } from 'antd'
import {SOCKET_STATUS} from '@/ws/constant'
import {Tag} from 'antd'
import {useSelector} from 'react-redux'
import {createSocket, destroySocket, sendHearbeatPacket} from '@/ws'
function SocketStatus (props: {
    status: SOCKET_STATUS
}){
    const {status} = props
    
    switch (status){
        case SOCKET_STATUS.connect:
            return <Tag color="success">连接</Tag>
        case SOCKET_STATUS.disconnect: 
            return <Tag color="error">断开</Tag>
        case SOCKET_STATUS.reconnecting:
            return <Tag color="processing">重连</Tag>
        default: 
            return <Tag>默认</Tag>
    }
}


const ConnectionHandler = () => {
    const {socketStatus} = useSelector((state: any) => state.socket)

    const reconnecting = () => {
        createSocket()
    }

    const hearbeat = () => {
        sendHearbeatPacket()
    }

    const disconnect = () => {
        destroySocket()
    }

    return <Connection>
        <div>当前连接状态</div>
        <SocketStatus status={socketStatus}/>
        <div className='buttonContainer'>
            <Button type='primary' onClick={reconnecting}>连接</Button>
            <Button onClick={hearbeat}>发送</Button>
            <Button danger onClick={disconnect}>断开</Button>
        </div>
    </Connection>
}

export default ConnectionHandler

const Connection = styled.div`
    padding: 5px 10px;
    display: flex;
    align-items: center;

    .buttonContainer {
        margin-left: 10px;
        display:flex;
        column-gap: 5px;
    }
`