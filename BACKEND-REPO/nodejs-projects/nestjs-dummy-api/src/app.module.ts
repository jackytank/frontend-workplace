import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasswordController } from './password/password.controller';

@Module({
  imports: [],
  controllers: [AppController, PasswordController],
  providers: [AppService],
})
export class AppModule {}
