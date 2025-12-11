// src/entities/book.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "books" })
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Evita errores en registros existentes con NULL
  @Column({ type: "text", nullable: false, default: "Untitled Book" })
  title!: string;

  @Column({ type: "text", nullable: true })
  author?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "decimal", nullable: true })
  price?: number;

  @Column({ type: "text", nullable: true })
  coverUrl?: string;

  @Column({ type: "text", nullable: true })
  pdfUrl?: string;
}
