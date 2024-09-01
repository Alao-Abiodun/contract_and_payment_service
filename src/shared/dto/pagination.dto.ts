import { IsOptional, IsString } from 'class-validator';
export class PaginationDto {
  @IsOptional()
  @IsString()
  pageSize: number;

  @IsOptional()
  @IsString()
  currentPage: number;
}
