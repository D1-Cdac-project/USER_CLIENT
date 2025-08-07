export const products = {
  'Vidya Vikas Photography': {
    priceId: 'price_1RPoM3SFr2YZLF7tmJ2JMKO6',
    description: 'sjdlfjas',
    mode: 'subscription'
  }
} as const;

export type ProductId = keyof typeof products;