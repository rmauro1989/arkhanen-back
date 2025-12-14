import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.usersRepo.findOneBy({ id });
  }

  async findAll() {
    return this.usersRepo.find({
      select: ["id", "email", "name", "createdAt"],
    });
  }
}
