import { Controller, Get } from '@nestjs/common';
import { name, version } from '../../package.json';

@Controller('health')
export class HealthController {
  @Get()
  healthCheck() {
    return `<h1>Service ${name} is up</h1><h2>version ${version}</h2>`;
  }
}
