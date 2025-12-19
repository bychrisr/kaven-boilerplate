import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class StripeService {
  async createCustomer(email: string) {
    return stripe.customers.create({ email });
  }
}
