import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  getTotalConnectedClients(server: Server) {
    return server.engine.clientsCount;
  }

  getTotalConnectedClientsInThisRoom(server: Server, room: string) {
    return server.sockets.adapter.rooms.get(room)?.size;
  }

  removeClientFromAllRoomsExceptOwn(client: Socket) {
    const rooms = Array.from(client.rooms).filter((r) => r !== client.id);
    rooms.forEach((r) => client.leave(r));
  }
}
