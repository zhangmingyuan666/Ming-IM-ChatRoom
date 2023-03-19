export const BASE_URL = 'http://127.0.0.1:9892'

export enum SOCKET_STATUS {
    disconnect = 'disconnect',
    connect = 'connect',
    reconnecting =' reconnecting'
}


export const each_heartbeat_time = 5 * 1000; // 间隔5s发送一个心跳包
export const heartbeat_timeout = 3 * 1000; // 3s没收到 认为超时
export const reconnect = 10 * 1000; // 10s重连时间

