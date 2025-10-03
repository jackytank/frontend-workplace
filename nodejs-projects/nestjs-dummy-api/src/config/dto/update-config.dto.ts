// src/config/dto/update-config.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateConfigDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  config_value?: string;
}
