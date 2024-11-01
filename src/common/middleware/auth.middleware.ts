import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: any, res: any, next: () => void) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? 'JWT_SECRET',
      });
      if (!payload.username) {
        throw new UnauthorizedException('Invalid token');
      }
      req['user'] = payload;
      GlobalSecurityContextHolder.setUser({
        username: payload?.username,
        id: payload?.sub,
      });
    } catch {
      throw new UnauthorizedException();
    }
    next();
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export interface IUserDTO {
  username: string;
  id: string;
}
export class GlobalSecurityContextHolder {
  private static user: IUserDTO | null = null;

  static setUser(user: IUserDTO) {
    this.user = user;
  }

  static getUser() {
    return this.user;
  }
}
