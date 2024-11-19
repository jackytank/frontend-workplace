// src/config/dto/create-user-config-file.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class CreateUserConfigFileDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsObject()
  userSetting: Record<string, any>;
}
