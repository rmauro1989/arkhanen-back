import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/entities/user.entity";
import { CapturePaymentDto } from "./dto/capture-payment.dto";

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() dto: CreatePaymentDto, @Req() req) {
    return this.paymentsService.createOrder(
      dto.bookIds,
      req.user.id,
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
      dto.bookId,
    );
  }
}
