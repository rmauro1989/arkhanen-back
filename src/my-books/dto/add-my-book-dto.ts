import { IsInt } from 'class-validator';

export class AddMyBookDto {
  @IsInt()
  bookId!: string;
}
