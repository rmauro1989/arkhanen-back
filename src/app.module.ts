// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { Book } from './entities/book.entity';

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
    BooksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
