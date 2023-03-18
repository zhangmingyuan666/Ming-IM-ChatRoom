export enum MessageFlow {
  'up' = 'up',
  'down' = 'down',
}

export enum IMessageType {
  message = 'message',
  sent_chatting_status = 'sent_chatting_status',
  connect = 'connect',
  after_connection = 'after_connection',
  join_meeting = 'join_meeting',
  send_message = 'send_message',
  create_meeting = 'create_meeting',
  somebody_outline = 'somebody_outline',
  get_message_in_meeting = 'get_message_in_meeting',
  get_message_out_meeting = 'get_message_out_meeting',
  message_sending_finish = 'message_sending_finish',
}

// 消息下行响应结构，服务端返回给客户的的数据结构
export interface IWsResponse {
  messageFlow: MessageFlow.down;
  code: number;
  type: IMessageType;
  data: {
    [key: string]: any;
  };
}

// 消息上行请求结构，服务端请求到的数据结构
export interface IWsRequest {
  messageFlow: MessageFlow.up;
  type: IMessageType;
  data: {
    [key: string]: any;
  };
}
