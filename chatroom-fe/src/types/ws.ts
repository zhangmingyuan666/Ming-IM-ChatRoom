export enum MessageFlow {
    "up" = "up",
    "down" = "down"
}



export enum ISendMessageType {
    message = 'message',
    sent_chatting_status = 'sent_chatting_status',
    connect = 'connect',
    after_connection = 'after_connection',
    join_meeting = 'join_meeting',
    send_message = 'send_message',
    create_meeting = 'create_meeting',
    somebody_outline='somebody_outline',
    get_message_in_meeting = 'get_message_in_meeting',
    get_message_out_meeting = 'get_message_out_meeting',
    heartbeat = 'heartbeat'
}

export enum IReceiveMessageType {
    message = 'message',
    sent_chatting_status = 'sent_chatting_status',
    connect = 'connect',
    disconnect = 'disconnect',
    after_connection = 'after_connection',
    join_meeting = 'join_meeting',
    send_message = 'send_message',
    create_meeting = 'create_meeting',
    somebody_outline='somebody_outline',
    get_message_in_meeting = 'get_message_in_meeting',
    get_message_out_meeting = 'get_message_out_meeting',
    message_sending_finish = 'message_sending_finish',
    heartbeat = 'heartbeat'
}

// 消息下行响应结构(接受消息)
export interface IWsResponse <T = {
    [key: string]: any
}> {
    messageFlow: MessageFlow.down,
    code: number,
    type: IReceiveMessageType
    data: T
}

// 消息上行发送结构(发送消息)
export interface IWsRequest <T = {
    [key: string]: any
}> {
    messageFlow: MessageFlow.up
    type: ISendMessageType
    data: T
}

export interface IChattingMessageReponseType {
    msg: string, 
    meeting_id: string,
    message_id: string,
    sender_id: string,
    receiver_id: string,
    is_msg_read: 0 | 1,
}