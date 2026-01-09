import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { paypalClient } from './paypal.client';

@Injectable()
export class PaypalService {
  private client = paypalClient();

  async createOrder(amount: string, localOrderId: string) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');

    request.requestBody({
      intent: 'CAPTURE',
      application_context: {
        application_context: {
          return_url: 'arkhanenbooks://paypal-return',
          cancel_url: 'arkhanenbooks://paypal-cancel',
        },
      },
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
    });

    const response = await this.client.execute(request);
    return response.result;
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await this.client.execute(request);
    return response.result;
  }
}
