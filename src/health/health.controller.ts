import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get()
  async checkHealth() {
    const dbStatus =
      this.connection.readyState === 1 ? 'connected' : 'disconnected';

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        name: this.connection.name,
      },
      memory: process.memoryUsage(),
      version: process.version,
    };
  }

  @Get('ping')
  ping() {
    return { message: 'pong', timestamp: new Date().toISOString() };
  }
}
