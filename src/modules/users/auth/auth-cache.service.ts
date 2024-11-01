import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthCacheService {
  private readonly blacklistKey = 'blacklistedTokens';
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async invalidToken(token: string) {
    // await this.cacheManager.set(this.blacklistKey + token, true, 60000);
  }

  async isTokenBlacklisted(token: string) {
    // return await this.cacheManager.get(this.blacklistKey + token);
    return false;
  }

  // refresh token
  async invalidRefreshToken(refreshToken: string) {
    // await this.cacheManager.set(
    //   this.blacklistKey + '-refesh-' + refreshToken,
    //   true,
    //   60000 * 24,
    // );
  }

  async isRefreshTokenInvalid(refreshToken: string) {
    // return await this.cacheManager.get(
    //   this.blacklistKey + '-refesh-' + refreshToken,
    // );
    return false;
  }
}
