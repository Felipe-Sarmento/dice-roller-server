import { Module } from '@nestjs/common';
import { DiceEventsGateway } from './gateway/dice-events.gateway';
import { DiceService } from './services/dice/dice.service';
import { SocketService } from './services/socket.service';

@Module({
  providers: [DiceEventsGateway, DiceService, SocketService],
})
export class DiceModule {}
