// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { Config } from './config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  providers: [ConfigService],
  controllers: [ConfigController],
})
export class ConfigModule {}
