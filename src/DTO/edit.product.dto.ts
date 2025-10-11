import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class EditProductDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
