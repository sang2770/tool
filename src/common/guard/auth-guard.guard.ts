import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import {
  GlobalSecurityContextHolder,
  IUserDTO
} from '../middleware/auth.middleware';
import { UserService } from 'src/modules/users/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const user: IUserDTO = GlobalSecurityContextHolder.getUser();
    const userEntity = await this.userService.findById(user.id);
    return !!userEntity;
  }
}
