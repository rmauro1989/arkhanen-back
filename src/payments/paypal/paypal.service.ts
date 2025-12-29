import * as paypal from '@paypal/checkout-server-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaypalService {
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    const env =
      process.env.PAYPAL_MODE === 'live'
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID!,
            process.env.PAYPAL_CLIENT_SECRET!,
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID!,
            process.env.PAYPAL_CLIENT_SECRET!,
          );

    this.client = new paypal.core.PayPalHttpClient(env);
  }

  async createOrder(amount: string) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');

    request.requestBody({
      intent: 'CAPTURE',
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
