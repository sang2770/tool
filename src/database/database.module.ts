import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import { SeederService } from './seeder/run.seeder';
import { AuthorizeModule } from 'src/modules/authorize/authorize.module';

@Module({
  imports: [
    UsersModule,
    AuthorizeModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development' ? true : false // Don't use synchronize: true in production
    })
  ],
  providers: [SeederService]
})
export class DatabaseModule {}
