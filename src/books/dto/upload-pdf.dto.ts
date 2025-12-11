import { IsOptional, IsString, IsNumber } from "class-validator";
import { Type } from 'class-transformer';

export class UploadPdfDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
