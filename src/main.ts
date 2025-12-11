import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from "./data-source";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB error", err);
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
