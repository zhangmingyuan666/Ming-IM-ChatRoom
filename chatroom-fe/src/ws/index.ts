import io, {Socket} from 'socket.io-client'
import {BASE_URL, SOCKET_STATUS} from './constant';
import {WsTypes} from '@/types';
import store from '@/store';
import {updateSocketStatus} from '@/store/slices/socket';
import {message} from 'antd';

// 保存当前Socket
let socket: Socket | null = null;
// 默认为断开状态
let webSocketState = SOCKET_STATUS.disconnect

export function getCurrentSocket() {
    if (socket) {
        return socket
    }

    console.log({
        msg: '当前还没创建socket'
    });
}

export const getCurrentSocketState = () => {
    return webSocketState
}

// 根据两个id来创建一个socket
export function createSocket() {
    console.log('socket', socket);
    if (socket) {
        console.log({
            msg: '当前已经存在socket了'
        })
        return
    }
    const client = io(BASE_URL).connect();
    socket = client
    initSocket()
    console.log(socket);
}

export function destroySocket(){
    if(!socket){
        console.log('socket已经被销毁');
        return
    }

    // 刷新页面的时候会自动销毁
    socket.close();
    socket = null;
}

// 创建的时候进行初始化操作
export function initSocket() {
     onMessage(WsTypes.IReceiveMessageType.connect, () => {
         console.log('连接成功：client', socket);
         store.dispatch(updateSocketStatus(SOCKET_STATUS.connect))
         const {user} = store.getState()
         const {userInfo} = user

         if(socket?.id){
            // 处理connect行为: after-connection
            const {userId, username} = userInfo
            sendMessage(WsTypes.ISendMessageType.after_connection, {
                userId,
                username,
                socketId: socket.id
            })
        }
     });

     onMessage(WsTypes.IReceiveMessageType.disconnect, (args: any) => {
        console.log('断开连接----- ', args);
        store.dispatch(updateSocketStatus(SOCKET_STATUS.disconnect))
     })

     onMessage(WsTypes.IReceiveMessageType.heartbeat, () => {
        message.success('接收到了心跳包')
    })

     

    // // 对于onMessage进行初始化
    // onMessage(WsTypes.IReceiveMessageType.message, (args: any) => {
    //     console.log('收到了message消息', 'args', args);
    // });

    // onMessage(WsTypes.IReceiveMessageType.after_connection, (args: any) => {
    //     console.log('有人登录了', 'args', args);
    // });


    // onMessage(WsTypes.IReceiveMessageType.somebody_outline, (args: any) => {
    //     console.log('离线了', args);
    // });
}

// 接受消息，接收到消息指定的回调
export function onMessage(messageType: WsTypes.IReceiveMessageType, callback: any) {
    socket?.on(messageType, (args: WsTypes.IWsResponse) => {
        callback && callback(args)
    })
}

export function sendHearbeatPacket(){
    sendMessage(WsTypes.ISendMessageType.heartbeat)
}

// 发送消息
export function sendMessage(
    messageType: WsTypes.ISendMessageType,
    message?: {[key: string]: any},
    messageFlow?: WsTypes.MessageFlow) {

    if (!messageFlow) {
        messageFlow = WsTypes.MessageFlow.up
    }

    // 发送消息规范化
    socket?.emit(messageType, {
        messageFlow,
        type: messageType,
        data: {
            ...message
        } as WsTypes.IWsRequest,
    })
}

export function offMessage(messageType: WsTypes.IReceiveMessageType, callback?: any){
    socket?.off(messageType, callback)
}

