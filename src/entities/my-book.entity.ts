import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from "typeorm";
import { User } from "./user.entity";
import { Book } from "./book.entity";

@Entity("my_books")
export class MyBook {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  book!: Book;

  @CreateDateColumn()
  purchasedAt!: Date;

  @Column({ default: true })
  isActive!: boolean;
}
