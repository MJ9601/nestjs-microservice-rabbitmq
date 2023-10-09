import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('varchar', { length: 50 })
  urlParam: string;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 300 })
  description: string;

  @Column('float')
  price: number;

  @Column('varchar', { length: 100, nullable: true })
  imageUrl: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
