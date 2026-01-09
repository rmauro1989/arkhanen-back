import * as paypal from '@paypal/checkout-server-sdk';

export function paypalClient() {
  const environment =
    process.env.NODE_ENV === 'production'
      ? new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID!,
          process.env.PAYPAL_CLIENT_SECRET!,
        )
      : new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID!,
          process.env.PAYPAL_CLIENT_SECRET!,
        );

  return new paypal.core.PayPalHttpClient(environment);
}
