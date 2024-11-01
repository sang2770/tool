import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchRequest {
  @ApiProperty({ description: 'Search keyword', required: false })
  @IsString()
  @IsOptional()
  keyword?: string = '';

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @ApiProperty({ description: 'Page size', required: false, default: 30 })
  @IsOptional()
  @IsNumber()
  pageSize: number = 30;

  @ApiProperty({ description: 'Sort by field', required: false })
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', default: 'ASC', required: false })
  @IsString()
  order: string = 'ASC';
}
