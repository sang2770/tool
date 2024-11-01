import * as bcrypt from 'bcryptjs';
import { AuthConstants } from '../constants/config.constants';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SearchRequest } from '../model/request';

export class CommonService {
  public static hashPassword(password: string) {
    return bcrypt.hashSync(password, AuthConstants.ENCRYPT_SALT);
  }
}

export abstract class AbstractSearchService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async searchQuery(
    request: SearchRequest
  ): Promise<{ data: T[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('U');
    this.createWhereQuery(queryBuilder, request);
    this.createOrderQuery(queryBuilder, request.sortBy);
    queryBuilder.skip((request.page - 1) * request.pageSize);
    queryBuilder.take(request.pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  protected abstract createWhereQuery(
    queryBuilder: SelectQueryBuilder<T>,
    querySearch: SearchRequest
  ): void;

  protected createOrderQuery(
    queryBuilder: SelectQueryBuilder<T>,
    sortBy?: string
  ): void {
    if (sortBy) {
      queryBuilder.orderBy(sortBy.replace('.', ' '));
    } else {
      queryBuilder.orderBy('U.lastModifiedAt', 'DESC');
    }
  }
}
