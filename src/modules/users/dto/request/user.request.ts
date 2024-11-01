import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { SearchRequest } from 'src/common/model/request';

export class UserOrganizationRequest {
  @ApiProperty({ description: 'Organization ID' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Is Root' })
  @IsOptional()
  @IsBoolean()
  isRoot?: boolean;

  @ApiProperty({ description: 'Is Supervisor' })
  @IsOptional()
  @IsBoolean()
  isSupervisor?: boolean;
}

export class UserRequest {
  @ApiProperty({ description: 'Full name of the user' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  username: string; // employee code
  // password: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Organization IDs of the user',
    type: [UserOrganizationRequest]
  })
  @IsOptional()
  organizations?: UserOrganizationRequest[];

  @ApiProperty({ description: 'Password of the user' })
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Role IDs of the user' })
  @IsOptional()
  roleIds?: string[];
}

export class UserSearchRequest extends SearchRequest {
}
