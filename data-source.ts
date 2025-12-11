import { DataSource } from "typeorm";
import { Book } from "./src/entities/book.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [Book],
  synchronize: true, // SOLO en desarrollo
});
