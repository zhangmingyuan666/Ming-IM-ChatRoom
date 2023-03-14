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
    somebody_outline='somebody_outline'
}

export enum IReceiveMessageType {
    message = 'message',
    sent_chatting_status = 'sent_chatting_status',
    connect = 'connect',
    after_connection = 'after_connection',
    join_meeting = 'join_meeting',
    send_message = 'send_message',
    create_meeting = 'create_meeting',
    somebody_outline='somebody_outline'
}

// 消息下行响应结构(接受消息)
export interface IWsResponse {
    messageFlow: MessageFlow.down,
    code: number,
    type: IReceiveMessageType
    data: {
        [key: string]: any
    }
}

// 消息上行发送结构(发送消息)
export interface IWsRequest {
    messageFlow: MessageFlow.up
    type: ISendMessageType
    data: {
        [key: string]: any
    }
}