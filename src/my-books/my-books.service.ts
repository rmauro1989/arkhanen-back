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

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async addBookToUser(user: User, bookId: string) {
    const book = await this.booksRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const managedUser = await this.usersRepo.findOne({
      where: { id: user.id },
    });

    if (!managedUser) {
      throw new NotFoundException('User not found');
    }

    const exists = await this.myBooksRepo.findOne({
      where: {
        user: { id: user.id },
        book: { id: book.id },
      },
      relations: ['user', 'book'],
    });

    if (exists) return exists;

    const myBook = this.myBooksRepo.create({
      user: managedUser,
      book
    });
    console.log('myBook-- create--->', myBook);

    const responseMyBook = this.myBooksRepo.save(myBook);

    console.log('responseMyBook----->', responseMyBook);
    
    return responseMyBook;
  }

  async getUserBooks(userId: string) {
    return this.myBooksRepo.find({
      where: { user: { id: userId }, isActive: true },
      relations: ["book"],
    });
  }
}
