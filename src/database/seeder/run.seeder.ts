import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRequest } from 'src/modules/users/dto/request/user.request';
import { UserService } from 'src/modules/users/user/user.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private userService: UserService
  ) {}
  onModuleInit() {
    console.log('Seeding...');

    this.seed();
    console.log('Database seeding completed');
  }

  private async seed() {
    const admin = await this.userService.findOneByUsernameOrEmail(
      process.env.ADMIN_USER,
      process.env.ADMIN_USER
    );
    if (!admin) {
      const request: UserRequest = {
        username: process.env.ADMIN_USER,
        email: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASSWORD,
        fullName: process.env.ADMIN_USER
      };
      await this.userService.create(request);
    }

  }
}
