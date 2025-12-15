// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { Book } from './entities/book.entity';
import { UsersModule } from './users/users.module';
import { MyBooksModule } from './my-books/my-books.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Book],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    MyBooksModule,
    BooksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
