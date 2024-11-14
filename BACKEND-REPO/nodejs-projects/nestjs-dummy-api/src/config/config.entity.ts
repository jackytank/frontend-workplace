import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_specific_configuration' })
export class Config {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  config_key: string;

  @Column({ type: 'text', nullable: false })
  config_value: string;
}

