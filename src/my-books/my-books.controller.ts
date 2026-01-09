import { Controller, Get, Post, Param, UseGuards, Body } from "@nestjs/common";
import { MyBooksService } from "./my-books.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../entities/user.entity";
import { CurrentUser } from "../auth/current-user.decorator";
import { AddMyBookDto } from "./dto/add-my-book-dto";

@Controller("my-books")
export class MyBooksController {
  constructor(private readonly myBooksService: MyBooksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  getUserBooks(@Param("userId") userId: string) {
    return this.myBooksService.getUserBooks(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("add")
  async addBookToUser(
    @CurrentUser() user: User,
    @Body() dto: AddMyBookDto,
  ) {
    return this.myBooksService.addBookToUser(user, dto.bookId);
  }
}
