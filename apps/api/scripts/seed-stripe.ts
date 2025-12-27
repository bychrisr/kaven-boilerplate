import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env');
  process.exit(1);
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover' as any,
  typescript: true,
});

async function main() {
  console.log('🚀 Starting Stripe Seed...');

  const products = [
    {
      name: 'Starter Plan',
      description: 'Perfect for individuals and small projects',
      prices: [
        { unit_amount: 2999, currency: 'brl', interval: 'month' as const },
        { unit_amount: 29999, currency: 'brl', interval: 'year' as const },
      ],
      metadata: { code: 'STARTER' },
    },
    {
      name: 'Pro Plan',
      description: 'For growing teams and businesses',
      prices: [
        { unit_amount: 7999, currency: 'brl', interval: 'month' as const },
        { unit_amount: 79999, currency: 'brl', interval: 'year' as const },
      ],
      metadata: { code: 'PRO' },
    },
    {
      name: 'Enterprise Plan',
      description: 'Advanced features for large scale',
      prices: [
        { unit_amount: 19999, currency: 'brl', interval: 'month' as const },
        { unit_amount: 199999, currency: 'brl', interval: 'year' as const },
      ],
      metadata: { code: 'ENTERPRISE' },
    },
  ];

  for (const productData of products) {
    console.log(`\nChecking product: ${productData.name}...`);

    let product = null;

    // Search by name
    const search = await stripe.products.search({
      query: `name:'${productData.name}'`,
    });

    if (search.data.length > 0) {
      product = search.data[0];
      console.log(`✅ Found existing product: ${product.id}`);
    } else {
      product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        metadata: productData.metadata,
      });
      console.log(`✨ Created new product: ${product.id}`);
    }

    // Process prices
    for (const priceData of productData.prices) {
      const prices = await stripe.prices.list({
        product: product.id,
        currency: priceData.currency,
        recurring: { interval: priceData.interval },
        active: true,
      });

      if (prices.data.length > 0) {
        console.log(`   ✅ Found ${priceData.interval} price: ${prices.data[0].id}`);
      } else {
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: priceData.unit_amount,
          currency: priceData.currency,
          recurring: { interval: priceData.interval },
        });
        console.log(`   ✨ Created ${priceData.interval} price: ${price.id}`);
      }
    }
  }

  console.log('\n✅ Stripe Seed Completed Successfully!');
}

main().catch((error) => {
  console.error('❌ Error seeding Stripe:', error);
  process.exit(1);
});
