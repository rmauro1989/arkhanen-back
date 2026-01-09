import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MyBook } from "../entities/my-book.entity";
import { MyBooksService } from "./my-books.service";
import { MyBooksController } from "./my-books.controller";
import { Book } from "../entities/book.entity";
import { User } from "../entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([MyBook, Book, User]),
  ],
  providers: [MyBooksService],
  controllers: [MyBooksController],
  exports: [MyBooksService],
})
export class MyBooksModule {}
