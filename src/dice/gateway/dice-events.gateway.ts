import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DiceService } from '../services/dice/dice.service';
import { Logger } from '@nestjs/common';
import { SocketService } from '../services/socket.service';

type User = {
  name: string;
  number: number;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DiceEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger;

  constructor(
    private readonly socketService: SocketService,
    private readonly diceService: DiceService,
  ) {
    this.logger = new Logger(DiceEventsGateway.name);
  }

  @WebSocketServer()
  server: Server;

  private roomValues: Map<string, User> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(
      `Client connected: ${client.id}, total clients: ${this.socketService.getTotalConnectedClients(this.server)}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Client disconnected: ${client.id}, total clients: ${this.socketService.getTotalConnectedClients(this.server)}`,
    );
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.socketService.removeClientFromAllRoomsExceptOwn(client);

    client.join(room);
    this.logger.log(
      `Cliente ${client.id} entrou na sala ${room}, total de clientes na sala: ${this.socketService.getTotalConnectedClientsInThisRoom(this.server, room)}`,
    );
    client.emit('joinedRoom', `Você entrou na sala ${room}`);

    const user = this.roomValues.get(room);

    if (!user?.number) {
      client.emit('value', {
        value: null,
        message: 'Nenhum valor de roll salvo para esta sala',
      });
    } else {
      client.emit('value', {
        value: user.number,
        message: `Último valor rolado: ${user.number} por ${user.name}`,
      });
    }
  }

  @SubscribeMessage('roll')
  handleRoll(
    @ConnectedSocket() client: Socket,
    @MessageBody() name: string,
  ): void {
    const randomNumberFromOneToSix = this.diceService.roll();

    const rooms = Array.from(client.rooms).filter((room) => room !== client.id);

    rooms.forEach((room) => {
      this.roomValues.set(room, {
        name,
        number: randomNumberFromOneToSix,
      });
      this.server.to(room).emit('value', {
        value: randomNumberFromOneToSix,
        message: `Último valor rolado: ${randomNumberFromOneToSix} por ${name}`,
      });
    });
  }
}
