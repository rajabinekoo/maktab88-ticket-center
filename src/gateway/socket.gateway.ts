import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8000)
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  roomLimit = 2;
  roomId = 1;
  rooms: { roomName: string; clients: number }[] = [];

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Client with clientId: ${socket.id} connected.`);
      let roomName = `room-${this.roomId}`;
      const targetRoom = this.rooms.find((el) => el.roomName === roomName);
      if (targetRoom?.clients >= this.roomLimit) {
        this.roomId += 1;
        roomName = `room-${this.roomId}`;
        this.rooms.push({ roomName, clients: 1 });
      } else if (!!targetRoom) {
        this.rooms = this.rooms.map((el) => {
          if (el.roomName === roomName) {
            return {
              roomName: el.roomName,
              clients: el.clients + 1,
            };
          }
          return el;
        });
      } else {
        this.rooms.push({ roomName, clients: 1 });
      }
      //   kick client out:
      //   socket.disconnect();
      //   throw error:
      //   throw new WsException('asdasdasdsa');
      socket.data = { test: 'test', roomName: roomName };
      socket.join(roomName);
      socket.join(socket.id);
      console.log('rooms', this.rooms);
      console.log('roomId', this.roomId);
    });
  }

  @SubscribeMessage('sayHello')
  subscribeOnHelloEventFromClient(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(client.data.roomName).emit('sayHelloResponse', {
      notif: 'New Message',
      content: body,
    });
    console.log(client.data);
    client.emit(`sayHello-${client.id}`, { notif: 'your message recevied' });
    this.server.to(client.id).emit(`sayHelloResponse2`, {
      notif: 'your message recevied',
      clientId: client.id,
    });
    return 'Your message received';
  }
}
