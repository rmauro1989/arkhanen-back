import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MyBook } from "../entities/my-book.entity";
import { User } from "../entities/user.entity";
import { Book } from "../entities/book.entity";

@Injectable()
export class MyBooksService {
  constructor(
    @InjectRepository(MyBook)
    private myBooksRepo: Repository<MyBook>,
  ) {}

  async addBookToUser(user: User, book: Book) {
    const exists = await this.myBooksRepo.findOne({
      where: {
        user: { id: user.id },
        book: { id: book.id },
      },
      relations: ["user", "book"],
    });

    if (exists) return exists;

    const myBook = this.myBooksRepo.create({
      user,
      book,
    });

    return this.myBooksRepo.save(myBook);
  }

  async getUserBooks(userId: string) {
    return this.myBooksRepo.find({
      where: { user: { id: userId }, isActive: true },
      relations: ["book"],
    });
  }
}
