import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../entities/user.entity";
import { CapturePaymentDto } from "./dto/capture-payment.dto";
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;

    return this.paymentsService.createOrder(
      dto.bookIds,
      userId,
    );
  }


  @Post('capture-order')
  captureOrder(
    @CurrentUser() user: User,
    @Body() dto: CapturePaymentDto,
  ) {
    return this.paymentsService.captureOrder(
      user,
      dto.orderId,
      dto.bookIds,
    );
  }

}
