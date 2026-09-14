import { Transform } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(1000)
  no: number;
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  name: string;
}
