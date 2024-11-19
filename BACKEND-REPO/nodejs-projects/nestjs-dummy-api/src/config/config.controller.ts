import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './config.entity';
import { CreateUserConfigFileDto } from './dto/create-user-config-file.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('GetAllUserConfig')
  findAll(): Promise<Config[]> {
    return this.configService.findAll();
  }

  @Post('CreateUserConfig')
  create(@Body() createConfigDto: CreateConfigDto): Promise<Config> {
    return this.configService.create(createConfigDto);
  }

  @Put('UpdateUserConfig')
  update(@Body() updateConfigDto: UpdateConfigDto): Promise<Config> {
    const { user_id: config_key, ...updateData } = updateConfigDto;
    return this.configService.update(config_key, updateData);
  }

  @Delete('DeleteUserConfig')
  remove(@Body('config_key') config_key: string): Promise<void> {
    return this.configService.remove(config_key);
  }

  @Post('CreateUserConfigFile')
  async createUserConfigFile(
    @Body() createUserConfigFileDto: CreateUserConfigFileDto,
  ): Promise<void> {
    const { userId, userSetting } = createUserConfigFileDto;
    const basePath = path.resolve(
      'C:/Users/tminhto/Desktop/EcoAssist/public/resources/user',
    );
    const filePath = path.join(basePath, userId, 'eelproperties.json');
    // Ensure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // Write the file
    fs.writeFileSync(filePath, JSON.stringify(userSetting, null, 2));
  }
}
