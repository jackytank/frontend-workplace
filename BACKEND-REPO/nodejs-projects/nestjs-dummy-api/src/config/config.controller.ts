import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './config.entity';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  findAll(): Promise<Config[]> {
    return this.configService.findAll();
  }

  @Get(':config_key')
  findOne(@Param('config_key') config_key: string): Promise<Config> {
    return this.configService.findOne(config_key);
  }

  @Post()
  create(@Body() createConfigDto: CreateConfigDto): Promise<Config> {
    return this.configService.create(createConfigDto);
  }

  @Put(':config_key')
  update(
    @Param('config_key') config_key: string,
    @Body() updateConfigDto: UpdateConfigDto,
  ): Promise<Config> {
    return this.configService.update(config_key, updateConfigDto);
  }

  @Delete(':config_key')
  remove(@Param('config_key') config_key: string): Promise<void> {
    return this.configService.remove(config_key);
  }
}
