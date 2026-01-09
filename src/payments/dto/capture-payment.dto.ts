import { IsArray, IsUUID } from 'class-validator';

export class CapturePaymentDto {
  orderId: string;

  @IsArray()
  @IsUUID("all", { each: true })
  bookIds: string[];
}
