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

  async addBookToUser(user: { userId: string; email: string }, bookId: string) {
    console.log('addBookToUser - user', user);
    console.log('addBookToUser - bookId', bookId);

    // 1️⃣ Buscar el libro completo
    const book = await this.booksRepo.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    console.log('Book found:', book);

    // 2️⃣ Revisar si ya existe la relación MyBook
    const exists = await this.myBooksRepo.findOne({
      where: {
        user: { id: user.userId }, // 🔑 Usar userId como id
        book: { id: book.id },
      },
      relations: ['user', 'book'],
    });

    if (exists) {
      console.log('Book already added to user:', exists);
      return exists;
    }

    // 3️⃣ Crear y guardar la relación MyBook usando solo IDs
    const myBook = this.myBooksRepo.create({
      user: { id: user.userId }, // TypeORM infiere relación por PK
      book: { id: book.id },
    });

    console.log('Saving MyBook:', myBook);

    return this.myBooksRepo.save(myBook);
  }



  async getUserBooks(userId: string) {
    return this.myBooksRepo.find({
      where: { user: { id: userId }, isActive: true },
      relations: ["book"],
    });
  }
}
