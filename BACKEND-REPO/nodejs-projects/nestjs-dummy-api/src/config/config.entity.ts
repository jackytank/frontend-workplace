import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_specific_config' })
export class Config {
  @PrimaryColumn({ type: 'varchar', length: 255, name: 'user_id' })
  user_id: string;

  @Column({ type: 'text', nullable: false, name: 'config_value' })
  config_value: string;
}
