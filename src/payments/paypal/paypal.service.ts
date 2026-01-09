import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PaypalService {
  private readonly clientId = process.env.PAYPAL_CLIENT_ID!;
  private readonly clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  private readonly baseUrl =
    process.env.PAYPAL_ENV === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  // ============================
  // 🔐 ACCESS TOKEN
  // ============================
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

  // ============================
  // 🧾 CREATE ORDER
  // ============================
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
            return_url: 'arkhanenbooks://paypal-return',
            cancel_url: 'arkhanenbooks://paypal-cancel',
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Error creating PayPal order',
      );
    }

    return data;
  }

  // ============================
  // 💰 CAPTURE ORDER
  // ============================
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
      throw new InternalServerErrorException(
        'Error capturing PayPal order',
      );
    }

    return data;
  }
}
