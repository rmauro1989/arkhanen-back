import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('paypal')
export class PaypalRedirectController {
  @Get('return')
  paypalReturn(
    @Query('token') orderId: string,
    @Res() res: Response,
  ) {
    const deepLink = `arkhanenbooks://paypal-return?orderId=${orderId}`;
    return res.redirect(deepLink);
  }

  @Get('cancel')
  paypalCancel(@Res() res: Response) {
    return res.redirect('arkhanenbooks://paypal-cancel');
  }
}
