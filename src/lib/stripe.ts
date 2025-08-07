import { loadStripe } from '@stripe/stripe-js';
import { products } from '../stripe-config';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createCheckoutSession(productId: keyof typeof products) {
  const stripe = await stripePromise;

  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }

  const product = products[productId];

  if (!product) {
    throw new Error('Invalid product');
  }

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      price_id: product.priceId,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/cancel`,
      mode: product.mode,
    }),
  });

  const { error, url } = await response.json();

  if (error) {
    throw new Error(error);
  }

  if (!url) {
    throw new Error('No checkout URL returned');
  }

  window.location.href = url;
}