import { Injectable, NotFoundException } from "@nestjs/common";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MyBook } from "../entities/my-book.entity";
import { User } from "../entities/user.entity";
import { Book } from "../entities/book.entity";

@Injectable()
export class MyBooksService {
  private s3: S3Client;

  constructor(
    @InjectRepository(MyBook)
    private myBooksRepo: Repository<MyBook>,

    @InjectRepository(Book)
    private readonly booksRepo: Repository<Book>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {
    this.s3 = new S3Client({
      endpoint: process.env.AWS_ENDPOINT_URL,
      region: process.env.AWS_DEFAULT_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });
  }

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

    const responseMyBook = this.myBooksRepo.save(myBook);
    
    return responseMyBook;
  }

  async getUserBooks(userId: string) {
    const myBooks = await this.myBooksRepo.find({
      where: { user: { id: userId }, isActive: true },
      relations: ["book"],
    });

    console.log('myBooks---->', myBooks);
    

    return Promise.all(
      myBooks.map(async (b) => {
        let presignedCoverUrl: string | null = null;

        if (b.book.coverUrl) {
          presignedCoverUrl = await getSignedUrl(
            this.s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: b.book.coverUrl,
            }),
            { expiresIn: 7200 }
          );
        }

        let presignedPdfUrl: string | null = null;

        if (b.book.coverUrl) {
          presignedPdfUrl = await getSignedUrl(
            this.s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: b.book.pdfUrl,
            }),
            { expiresIn: 86400 }
          );
        }

        return {
          id: b.book.id,
          title: b.book.title,
          author: b.book.author,
          price: b.book.price,
          coverUrl: presignedCoverUrl,
          pdf: presignedPdfUrl
        };
      })
    );
  }
}
