import { IsArray, IsString, IsUUID } from 'class-validator';

export class CapturePaymentDto {
  @IsString()
  orderId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  bookIds!: string[];
}
