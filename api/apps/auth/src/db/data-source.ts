import { UserEntity } from 'apps/auth/src/typeorm/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: +process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'postgres_db',
  entities: [UserEntity],
  migrations: ['dist/apps/auth/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
