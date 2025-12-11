// src/books/books.service.ts
import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Book } from "../entities/book.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadPdfDto } from "./dto/upload-pdf.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class BooksService {
  private s3: S3Client;

  constructor(
    @InjectRepository(Book)
    private booksRepo: Repository<Book>,
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

  // Subir libro (PDF + portada)
  async uploadBook(
    filePdf: Express.Multer.File,
    fileCover: Express.Multer.File,
    metadata: UploadPdfDto
  ) {
    if (!metadata.title) throw new Error("Title is required");

    const bookId = uuidv4();

    // Generar nombres de archivo
    const pdfFileName = `${bookId}.pdf`;
    const coverExtension = fileCover.originalname.split('.').pop() || "png";
    const coverFileName = `${bookId}-cover.${coverExtension}`;

    // Subir PDF
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: pdfFileName,
        Body: filePdf.buffer,
        ContentType: "application/pdf",
      })
    );

    // Subir portada
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: coverFileName,
        Body: fileCover.buffer,
        ContentType: fileCover.mimetype,
      })
    );

    // Crear registro en DB
    const book = this.booksRepo.create({
      id: bookId,
      title: metadata.title,
      author: metadata.author || "",
      description: metadata.description || "",
      price: metadata.price !== undefined ? Number(metadata.price) : 0,
      pdfUrl: pdfFileName,       // guardamos solo la key
      coverUrl: coverFileName,   // guardamos solo la key
    });

    await this.booksRepo.save(book);

    // Generar pre-signed URLs temporales
    const downloadPdfUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: pdfFileName,
      }),
      { expiresIn: 3600 } // 1 hora
    );

    const downloadCoverUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: coverFileName,
      }),
      { expiresIn: 3600 } // 1 hora
    );

    return {
      message: "Book uploaded successfully",
      book,
      downloadPdfUrl,
      downloadCoverUrl,
    };
  }

  // Consultar libros y generar URL de portada
  async getBooksWithCover() {
    const books = await this.booksRepo.find();

    return Promise.all(
      books.map(async (b) => {
        let presignedCoverUrl: string | null = null;

        if (b.coverUrl) {
          presignedCoverUrl = await getSignedUrl(
            this.s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: b.coverUrl, // solo la key
            }),
            { expiresIn: 7200 } // 2 horas
          );
        }

        return {
          id: b.id,
          title: b.title,
          author: b.author,
          price: b.price,
          coverUrl: presignedCoverUrl,
        };
      })
    );
  }
}
