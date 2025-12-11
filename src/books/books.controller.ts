// src/books/books.controller.ts
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Get
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { BooksService } from "./books.service";
import { UploadPdfDto } from "./dto/upload-pdf.dto";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post("/upload")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "pdf", maxCount: 1 },
      { name: "cover", maxCount: 1 },
    ])
  )
  async uploadBook(
    @UploadedFiles() files: { pdf?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Body() metadata: UploadPdfDto
  ) {
    const pdf = files.pdf?.[0];
    const cover = files.cover?.[0];

    if (!pdf) throw new Error("No PDF file uploaded");
    if (!cover) throw new Error("No cover file uploaded");

    return this.booksService.uploadBook(pdf, cover, metadata);
  }

  @Get()
  async getAllBooks() {
    return this.booksService.getBooksWithCover();
  }
}
