import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { MyBooksService } from "./my-books.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("my-books")
export class MyBooksController {
  constructor(private readonly myBooksService: MyBooksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  getUserBooks(@Param("userId") userId: string) {
    return this.myBooksService.getUserBooks(userId);
  }
}
