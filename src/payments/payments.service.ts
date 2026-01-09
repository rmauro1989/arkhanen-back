import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PaypalService } from "./paypal/paypal.service";
import { MyBooksService } from "../my-books/my-books.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "../entities/book.entity";
import { In, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly myBooksService: MyBooksService,
    @InjectRepository(Book)
    private readonly booksRepo: Repository<Book>,
  ) {}

 async createOrder(bookIds: string[], userId: string) {
  const books = await this.booksRepo.findBy({ id: In(bookIds) });

    const total = books.reduce(
      (sum, book) => sum + Number(book.price),
      0,
    );

    const order = await this.paypalService.createOrder(total?.toString() ?? '');
 
    const approveLink = order.links.find(
      (l: { rel: string; href: string }) => l.rel === 'approve',
    );

    return {
      orderId: order.id,
      approveUrl: approveLink?.href,
    };
  }



  async captureOrder(
    user: User,
    orderId: string,
    bookId: string,
  ) {
    const result = await this.paypalService.captureOrder(orderId);

    if (result.status !== 'COMPLETED') {
      throw new BadRequestException('Payment not completed');
    }

    // 🔥 SOLO AQUÍ se agrega el libro
    return this.myBooksService.addBookToUser(user, bookId);
  }
}
