import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  pageSize?: number;

  @IsOptional()
  currentPage?: number;

  @IsOptional()
  total?: number;
}
