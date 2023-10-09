import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('varchar', { unique: true, length: 90 })
  email: string;

  @Column('varchar', { length: 80, nullable: true })
  name?: string;

  @Column('varchar', { length: 100, nullable: true })
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
