import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  PageResponseWrapper,
  ResponseWrapper
} from 'src/common/model/response';
import { UserRequest, UserSearchRequest } from '../dto/request/user.request';
import { User } from './user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@ApiSecurity('bearer')
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOperation({ summary: 'Search users' })
  @ApiOkResponse({
    description: 'PageResponseWrapper of User',
    type: [User]
  })
  @Get('/')
  async search(
    @Query() request: UserSearchRequest
  ): Promise<PageResponseWrapper<User>> {
    return await this.userService.search(request);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ description: 'User creation request body', type: UserRequest })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User
  })
  @Post()
  async create(@Body() request: UserRequest): Promise<User> {
    return await this.userService.create(request);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: User
  })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ description: 'User update request body', type: UserRequest })
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: User
  })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UserRequest
  ): Promise<User> {
    return await this.userService.update(id, request);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiNoContentResponse({
    description: 'The user has been successfully deleted.'
  })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseWrapper<void>> {
    await this.userService.remove(id);
    return null;
  }
}
