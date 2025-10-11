import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
export class ProductDTO {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  img: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  createdAt: Date;
}
