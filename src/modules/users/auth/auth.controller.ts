import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest
} from '../dto/request/auth.request';
import { Public } from 'src/common/decorator/public.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiOperation,
  ApiBody
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@ApiSecurity('bearer')
@Controller('api/account')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    return await this.authService.login(loginRequest);
  }

  @ApiOperation({ summary: 'Logout user' })
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: any, @Body() logoutRequest: LogoutRequest) {
    const accessToken = req.headers['authorization'].replace('Bearer ', '');
    this.authService.logout(accessToken, logoutRequest);
    return null;
  }

  @Public()
  @ApiOperation({ summary: 'Refresh token' })
  @Post('refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest) {
    return this.authService.refreshToken(request);
  }
}
