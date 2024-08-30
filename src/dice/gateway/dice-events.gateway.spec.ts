import { Test, TestingModule } from '@nestjs/testing';
import { DiceEventsGateway } from './dice-events.gateway';

describe('DiceEventsGateway', () => {
  let gateway: DiceEventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiceEventsGateway],
    }).compile();

    gateway = module.get<DiceEventsGateway>(DiceEventsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
