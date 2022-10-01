import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { constants } from '../constants';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // type: configService.get('SQL_DATABASE_TYPE'),
        type: 'postgres',
        host: configService.get('POSTGRES_DB_HOST'),
        port: configService.get('POSTGRES_DB_HOST'),
        username: configService.get('POSTGRES_DB_USER'),
        password: configService.get('POSTGRES_DB_PASSWORD'),
        database: configService.get('POSTGRES_DB_DATABASE'),
        entities: [],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class TypeormDatabaseModule {}
