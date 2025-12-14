import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MyBook } from "../entities/my-book.entity";
import { MyBooksService } from "./my-books.service";
import { MyBooksController } from "./my-books.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MyBook])],
  providers: [MyBooksService],
  controllers: [MyBooksController],
})
export class MyBooksModule {}
