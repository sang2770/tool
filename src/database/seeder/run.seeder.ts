import { Injectable, OnModuleInit } from '@nestjs/common';
import { RESOURCE_CODE, SCOPE } from 'src/common/constants/auth.constants';
import { Permission } from 'src/modules/authorize/permision/permision.entity';
import { PermissionService } from 'src/modules/authorize/permision/permision.service';
import { UserRequest } from 'src/modules/users/dto/request/user.request';
import { UserService } from 'src/modules/users/user/user.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private userService: UserService,
    private permissionService: PermissionService
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

    await this.generatePermission();
  }

  private async generatePermission() {
    // for each resource
    const permissionList = [];
    const permissionExist = await this.permissionService.findAll();
    Object.values(RESOURCE_CODE).forEach(resource => {
      // for each scope
      Object.values(SCOPE).forEach(scope => {
        // create permission
        permissionList.push(
          new Permission({
            name: `${resource}:${scope}`,
            resource_code: resource,
            scope: scope
          })
        );
      });
    });
    permissionList.forEach(permission => {
      if (!permissionExist.some(p => p.name === permission.name)) {
        this.permissionService.create(permission);
      }
    });
  }
}
