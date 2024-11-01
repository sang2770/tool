import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthCacheService } from './auth/auth-cache.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'JWT_SECRET'
    }),
    CacheModule.register()
  ],
  providers: [
    UserService,
    AuthService,
    AuthCacheService,
  ],
  controllers: [UserController, AuthController],
  exports: [UserService, JwtModule]
})
export class UsersModule {}
