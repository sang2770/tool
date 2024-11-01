import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, SelectQueryBuilder, DataSource, In } from 'typeorm';
import { UserOrganizationRequest, UserRequest, UserSearchRequest } from '../dto/request/user.request';
import {
  AbstractSearchService,
  CommonService
} from 'src/common/service/common.service';
import { PageResponseWrapper } from 'src/common/model/response';
@Injectable()
export class UserService extends AbstractSearchService<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {
    super(userRepository);
  }


  protected createWhereQuery(
    queryBuilder: SelectQueryBuilder<User>,
    querySearch: UserSearchRequest
  ): void {
    queryBuilder.andWhere('U.deleted = false');
    if (querySearch.keyword) {
      queryBuilder.andWhere(
        '(U.username LIKE :keyword OR U.email LIKE :keyword OR U.fullName LIKE :keyword OR U.phoneNumber LIKE :keyword)',
        { keyword: `%${querySearch.keyword}%` }
      );
    }
  }
  async findOneByUsernameOrEmail(
    username: string,
    email: string
  ): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .andWhere('user.deleted = false')
      .orWhere('user.email = :email', { email })
      .andWhere('user.deleted = false')
      .getOne();
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .andWhere('user.deleted = false')
      .getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deleted: false }
    });
    return user;
  }

  async create(userData: UserRequest): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!userData.password) {
        userData.password = CommonService.hashPassword(userData.username);
      } else {
        userData.password = CommonService.hashPassword(userData.password);
      }
      const user = await queryRunner.manager.save(User, new User(userData));
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async search(request: UserSearchRequest): Promise<PageResponseWrapper<User>> {
    const result = await this.searchQuery(request);
    return new PageResponseWrapper(
      result.data,
      request.page,
      request.pageSize,
      result.total
    );
  }

  async findOne(id: string): Promise<User> {
    const user = await this.findById(id);
    return user;
  }

  async update(id: string, userData: UserRequest): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findOne(id);
      // apply data
      Object.assign(user, userData);
      await queryRunner.manager.update(User, id, user);
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.delete();
    await this.userRepository.update(id, user);
  }
}
