import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => (value === undefined ? undefined : parseInt(value)))
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Min(1)
  limit?: number;
  @Transform(({ value }) => (value === undefined ? undefined : parseInt(value)))
  @IsInt()
  @IsOptional()
  @Min(0)
  offset?: number;
}
