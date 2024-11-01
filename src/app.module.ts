import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvManagermentModule } from './modules/cv-managerment/cv-managerment.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [CvManagermentModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
