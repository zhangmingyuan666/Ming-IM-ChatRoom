import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/logical/socket/socket.service';
import { UserService } from 'src/logical/user/user.service';
import { IWsRequest, IWsResponse, IMessageType, MessageFlow } from 'src/types';

@WebSocketGateway(9892, { cors: true })
export class EventsGateway {
  constructor(
    private readonly userService: UserService,
    private readonly socketService: SocketService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    const socketMap = this.server.sockets.sockets;
    console.log('当前连接数', socketMap.size);
    console.log('断开连接id', client.id);

    // 我们需要处理socket在数据库的逻辑
    await this.socketService.leaveWithSocketId(client.id);

    // 广播此人已上线
    client.broadcast.emit(IMessageType.somebody_outline, {
      messageFlow: MessageFlow.down,
      type: IMessageType.after_connection,
      code: 200,
      data: {
        msg: `已下线～`,
      },
    } as IWsResponse);
  }

  @SubscribeMessage(IMessageType.connect)
  handleConnection(client: Socket): WsResponse<unknown> {
    //console.log('--------------');
    const socketMap = this.server.sockets.sockets;
    console.log('当前连接数', socketMap.size);

    console.log('已经连接成功' + client.id);
    //console.log('--------------');

    return {
      event: IMessageType.connect,
      data: {
        messageFlow: MessageFlow.down,
        type: IMessageType.connect,
        code: 200,
        data: {
          msg: `已经成功连接`,
        },
      },
    };
  }

  // 测试接口
  // @SubscribeMessage('message')
  // handleEvent(
  //   @MessageBody() data: unknown,
  //   @ConnectedSocket() client: Socket,
  // ): WsResponse<unknown> {
  //   console.log('ws hello data', data);
  //   client.broadcast.emit('message', 'broadcast');
  //   const event = 'message';
  //   return {
  //     event,
  //     data: {
  //       msg: 'ws 收到信息后返回',
  //     },
  //   };
  // }

  // 心跳包监测接口
  @SubscribeMessage('heartbeat')
  handleHeatbeat(@MessageBody() data: string) {
    return data;
  }

  // 告知对方连接状态变化
  // 在聊天室中，对方的登陆状态变化会通过ws告知我
  @SubscribeMessage(IMessageType.after_connection)
  async chattingStatusSend(
    @MessageBody() request: IWsRequest,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log(request);
    const { data, type } = request;
    const { username, userId, socketId } = data;

    console.log('-------上线，', request);

    await this.socketService.loginWithSocketIdAndUserId(socketId, userId);

    // 广播此人已上线
    client.broadcast.emit(IMessageType.after_connection, {
      messageFlow: MessageFlow.down,
      type: IMessageType.after_connection,
      code: 200,
      data: {
        msg: `${username}已上线～`,
      },
    } as IWsResponse);
  }

  @SubscribeMessage(IMessageType.create_meeting)
  createMeeting(
    @MessageBody() request: IWsRequest,
    @ConnectedSocket() client: Socket,
  ): IWsResponse {
    const { data, type } = request;
    const { meetingId } = data;
    // 加入meetingId房间
    client.join(meetingId);
    console.log('成功加入meeting房间', 'create-meeting', meetingId);

    return {
      messageFlow: MessageFlow.down,
      type: IMessageType.create_meeting,
      code: 200,
      data: {
        msg: `成功加入meeting房间`,
      },
    };
  }

  @SubscribeMessage(IMessageType.send_message)
  async sendMessage(
    @MessageBody() request: IWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const { data } = request;
    const { msg, userId, meetingId } = data;

    // 对以meetingId为id的room进行单播通信
    client.to(meetingId).emit('send_message', {
      messageFlow: MessageFlow.down,
      type: IMessageType.send_message,
      code: 200,
      data: {
        msg,
        userId,
        meetingId,
      },
    } as IWsResponse);
  }
}
