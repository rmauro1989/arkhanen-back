import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "../entities/book.entity";
import { MyBook } from "../entities/my-book.entity";
import { User } from "../entities/user.entity";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Book, MyBook, User])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
