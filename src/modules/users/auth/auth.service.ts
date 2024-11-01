import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest
} from '../dto/request/auth.request';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthCacheService } from './auth-cache.service';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn = '15m'; // 15 phút
  private readonly refreshTokenExpiresIn = '7d'; // 7 ngày
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly authCacheService: AuthCacheService
  ) {}

  private generateToken(user: User) {
    const accessToken = this.jwtService.sign(
      { username: user.username, sub: user.id },
      {
        expiresIn: this.accessTokenExpiresIn
      }
    );
    const refreshToken = this.jwtService.sign(
      { type: 'refresh', sub: user.id },
      { expiresIn: this.refreshTokenExpiresIn }
    );
    return { accessToken, refreshToken };
  }

  async login(loginRequest: LoginRequest) {
    const user: User = await this.usersService.findOneByUsername(
      loginRequest.username
    );
    if (!user || !bcrypt.compareSync(loginRequest.password, user.password)) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.generateToken(user);
  }

  async logout(accessToken: string, logoutRequest: LogoutRequest) {
    this.authCacheService.invalidToken(accessToken);
    this.authCacheService.invalidRefreshToken(logoutRequest.refreshToken);
  }

  async refreshToken(request: RefreshTokenRequest) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(request.refreshToken);
    } catch {
      throw new UnauthorizedException();
    }
    const userId = payload.sub;

    const user = await this.usersService.findById(userId);

    return this.generateToken(user);
  }
}
