import { Injectable, NotFoundException } from "@nestjs/common";
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

    @InjectRepository(Book)
    private readonly booksRepo: Repository<Book>,
  ) {}

  async addBookToUser(user: User, bookId: string) {
    console.log('addBookToUser - user', user);
    console.log('addBookToUser - bookId', bookId);

    const book = await this.booksRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const exists = await this.myBooksRepo.findOne({
      where: {
        user: { id: user.id }, // 🔑 usar id de la entidad
        book: { id: book.id },
      },
      relations: ['user', 'book'],
    });

    if (exists) return exists;

    const myBook = this.myBooksRepo.create({
      user: { id: user.id }, // solo ID para la relación
      book: { id: book.id },
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
