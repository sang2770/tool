import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { GlobalSecurityContextHolder } from '../middleware/auth.middleware';
import { ApiProperty } from '@nestjs/swagger';

export class IBaseEntity {
  @Column({ nullable: true })
  @ApiProperty({ description: 'User who created the entity' })
  createBy?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'User who last modified the entity' })
  lastModifiedBy?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the entity was created' })
  createAt?: number;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the entity was last modified' })
  lastModifiedAt?: number;

  @BeforeInsert()
  setCreateUser() {
    this.createBy = GlobalSecurityContextHolder.getUser()?.username ?? 'system';
  }

  @BeforeUpdate()
  setUpdateUser() {
    this.lastModifiedBy =
      GlobalSecurityContextHolder.getUser()?.username ?? 'system';
  }

  @Column({ default: false })
  @ApiProperty({ description: 'Indicates if the entity is deleted' })
  deleted: boolean;

  delete() {
    this.deleted = true;
  }

  unDelete() {
    this.deleted = false;
  }

  restore() {
    this.deleted = false;
  }
}
