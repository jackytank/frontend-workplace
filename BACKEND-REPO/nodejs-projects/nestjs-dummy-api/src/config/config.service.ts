import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './config.entity';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  findAll(): Promise<Config[]> {
    return this.configRepository.find();
  }

  findOne(config_key: string): Promise<Config> {
    return this.configRepository.findOneBy({ config_key });
  }

  create(createConfigDto: CreateConfigDto): Promise<Config> {
    const newConfig = this.configRepository.create(createConfigDto);
    console.log('newConfig', newConfig);
    return this.configRepository.save(newConfig);
  }

  async update(
    config_key: string,
    updateConfigDto: UpdateConfigDto,
  ): Promise<Config> {
    await this.configRepository.update({ config_key }, updateConfigDto);
    return this.configRepository.findOneBy({ config_key });
  }

  async remove(config_key: string): Promise<void> {
    await this.configRepository.delete({ config_key });
  }
}
