import Stripe from 'stripe';
import prisma from '../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

export class StripeService {
  /**
   * Criar ou buscar customer do Stripe
   */
  async getOrCreateCustomer(email: string, name: string, tenantId: string): Promise<string> {
    // Verificar se já existe customer
    const subscription = await prisma.subscription.findFirst({
      where: { tenant: { id: tenantId } },
      select: { stripeCustomerId: true },
    });

    if (subscription?.stripeCustomerId) {
      return subscription.stripeCustomerId;
    }

    // Criar novo customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { tenantId },
    });

    return customer.id;
  }

  /**
   * Criar subscription (plano pago)
   */
  async createSubscription(params: {
    tenantId: string;
    email: string;
    name: string;
    priceId: string; // ID do price no Stripe (ex: price_1234)
  }) {
    const { tenantId, email, name, priceId } = params;

    // Criar ou buscar customer
    const customerId = await this.getOrCreateCustomer(email, name, tenantId);

    // Criar subscription no Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Salvar no banco
    const subscription = await prisma.subscription.create({
      data: {
        tenantId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: stripeSubscription.id,
        status: 'TRIALING',
        planName: 'STARTER', // TODO: extrair do priceId
        priceMonthly: 29.99, // TODO: extrair do priceId
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
      },
    });

    // Retornar client secret para pagamento frontend
    const invoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = (invoice as any).payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      subscription,
    };
  }

  /**
   * Cancelar subscription
   */
  async cancelSubscription(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription não encontrada');
    }

    // Cancelar no Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Atualizar no banco
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: true,
      },
    });

    return { message: 'Subscription cancelada com sucesso' };
  }

  /**
   * Atualizar método de pagamento
   */
  async updatePaymentMethod(subscriptionId: string, paymentMethodId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      throw new Error('Subscription não encontrada');
    }

    // Anexar payment method ao customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: subscription.stripeCustomerId,
    });

    // Definir como default
    await stripe.customers.update(subscription.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return { message: 'Método de pagamento atualizado' };
  }

  /**
   * Listar métodos de pagamento do customer
   */
  async listPaymentMethods(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      throw new Error('Subscription não encontrada');
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: subscription.stripeCustomerId,
      type: 'card',
    });

    return paymentMethods.data;
  }

  /**
   * Processar webhook do Stripe
   */
  async handleWebhook(body: string | Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET não configurado');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Handler: Invoice payment succeeded
   */
  private async handleInvoicePaymentSucceeded(stripeInvoice: Stripe.Invoice) {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: (stripeInvoice as any).subscription as string },
    });

    if (!subscription) return;

    // Atualizar subscription para ACTIVE
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'ACTIVE' },
    });

    // Criar invoice no banco
    await prisma.invoice.create({
      data: {
        tenantId: subscription.tenantId,
        subscriptionId: subscription.id,
        invoiceNumber: stripeInvoice.number || `INV-${Date.now()}`,
        status: 'PAID',
        amountDue: (stripeInvoice.amount_due / 100),
        amountPaid: (stripeInvoice.amount_paid / 100),
        currency: stripeInvoice.currency.toUpperCase(),
        dueDate: new Date(stripeInvoice.due_date! * 1000),
        paidAt: new Date(),
        metadata: { stripeInvoiceId: stripeInvoice.id },
      },
    });
  }

  /**
   * Handler: Invoice payment failed
   */
  private async handleInvoicePaymentFailed(stripeInvoice: Stripe.Invoice) {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: (stripeInvoice as any).subscription as string },
    });

    if (!subscription) return;

    // Atualizar subscription para PAST_DUE
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'PAST_DUE' },
    });
  }

  /**
   * Handler: Subscription updated
   */
  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) return;

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: stripeSubscription.status.toUpperCase() as any,
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
      },
    });
  }

  /**
   * Handler: Subscription deleted
   */
  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) return;

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        deletedAt: new Date(),
      },
    });
  }
}

export const stripeService = new StripeService();
