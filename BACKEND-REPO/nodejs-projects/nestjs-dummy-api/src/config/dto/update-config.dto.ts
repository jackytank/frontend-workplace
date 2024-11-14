// src/config/dto/update-config.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateConfigDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  config_key?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  config_value?: string;
}
