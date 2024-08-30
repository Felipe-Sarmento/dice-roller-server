import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { DiceModule } from './dice/dice.module';

@Module({
  imports: [HealthModule, DiceModule],
})
export class AppModule {}
