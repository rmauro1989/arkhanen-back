import { DataSource } from "typeorm";
import { Book } from "./entities/book.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Book],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
