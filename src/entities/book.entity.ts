import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column("decimal")
  price!: number;

  @Column({ name: "cover_url" })
  coverUrl!: string;

  @Column("text")
  description!: string;
}
