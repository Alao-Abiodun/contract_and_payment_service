import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Datasource from './typeOrm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...Datasource.options,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
