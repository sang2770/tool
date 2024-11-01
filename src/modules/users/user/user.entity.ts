import { IBaseEntity } from 'src/common/model/base-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRequest } from '../dto/request/user.request';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends IBaseEntity {
  // uuid
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @Column({ name: 'full_name' })
  @ApiProperty({ description: 'Full name of the user' })
  fullName: string;

  @Column({ name: 'user_name' })
  @ApiProperty({
    description: 'Username of the user, also known as employee code'
  })
  username: string; // employee code

  @Column()
  password: string;
  @Column({ name: 'email_address' })
  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @Column({ name: 'is_active', default: true })
  @ApiProperty({ description: 'Indicates if the user is active' })
  isActive: boolean;

  @Column({ name: 'is_root', nullable: true })
  @ApiProperty({
    description: 'Indicates if the user has root access',
    required: false
  })
  isRoot?: boolean;

  constructor(cmd?: UserRequest) {
    super();
    if (cmd) {
      this.fullName = cmd.fullName;
      this.username = cmd.username;
      this.password = cmd.password;
      this.email = cmd.email;
      this.isActive = true;
    }
  }
}
