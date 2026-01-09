import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PaypalService {
  private readonly clientId = process.env.PAYPAL_CLIENT_ID!;
  private readonly clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  private readonly baseUrl =
    process.env.PAYPAL_ENV === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Error getting PayPal access token',
      );
    }

    return data.access_token;
  }

  async createOrder(total: string, localOrderId?: string) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: total,
              },
              custom_id: localOrderId,
            },
          ],
          application_context: {
            return_url: 'https://arkhanen-back-production.up.railway.app/paypal/return',
            cancel_url: 'https://arkhanen-back-production.up.railway.app/paypal/cancel',
            user_action: 'PAY_NOW',       // fuerza a PayPal a mostrar “Pagar ahora”
            landing_page: 'LOGIN',        // fuerza login page
          }

        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Error creating PayPal order',
      );
    }
    console.log('data----->', data);
    
    return data;
  }

  async captureOrder(orderId: string) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal capture error:', data);
      throw new InternalServerErrorException(
        'Error capturing PayPal order',
      );
    }

    return data;
  }
}
