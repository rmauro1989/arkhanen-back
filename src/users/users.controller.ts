import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ➕ Registro
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  // 📄 Obtener usuario
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  // 📄 Listar usuarios
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
