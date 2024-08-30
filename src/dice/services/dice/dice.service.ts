import { Injectable } from '@nestjs/common';

@Injectable()
export class DiceService {
  roll(): number {
    return this.randomDiceNumber();
  }

  private randomDiceNumber(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}
