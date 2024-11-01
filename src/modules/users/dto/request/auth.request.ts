import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ description: 'Password of the user' })
  @IsNotEmpty()
  password: string;
}

export class LogoutRequest {
  @ApiProperty({ description: 'Refresh token for logout' })
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshTokenRequest {
  @ApiProperty({ description: 'Refresh token for token refresh' })
  @IsNotEmpty()
  refreshToken: string;
}
