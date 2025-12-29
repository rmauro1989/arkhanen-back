import { IsString, IsUUID } from 'class-validator';

export class CapturePaymentDto {
  @IsString()
  orderId!: string;

  @IsUUID()
  bookId!: string;
}
