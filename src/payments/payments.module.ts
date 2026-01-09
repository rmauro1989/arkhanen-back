import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "../entities/book.entity";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { PaypalModule } from "../payments/paypal/paypal.module";
import { MyBooksModule } from "../my-books/my-books.module";

@Module({
  imports: [
    PaypalModule,
    MyBooksModule,
    TypeOrmModule.forFeature([Book])
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
