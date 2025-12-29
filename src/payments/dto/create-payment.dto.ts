import { IsUUID } from 'class-validator';

export class CreatePaymentDto {
  bookIds: string[];
}
