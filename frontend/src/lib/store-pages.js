import { products } from './products';

export const categories = {
  cleanse: {
    title: 'Cleansers',
    description: 'A fresh first step for your everyday ritual.',
    color: 'yellow',
    products: ['vitamin-c-face-wash']
  },
  protect: {
    title: 'Sun care',
    description: 'Make daily sun protection an easy part of your routine.',
    color: 'blue',
    products: ['aqua-sunscreen-gel-spf-50-pa-3plus']
  },
  hydrate: {
    title: 'Moisturizers',
    description: 'Lightweight hydration for a comfortable-feeling routine.',
    color: 'green',
    products: ['moisturizing-gel-oily-skin']
  },
  targeted: {
    title: 'Targeted care',
    description: 'A considered extra step for the concerns you want to explore.',
    color: 'rose',
    products: ['ocevia-brightening-cream']
  }
};

export const concernGuides = [
  {
    slug: 'breakout-prone-skin',
    title: 'Breakout-prone skin',
    description: 'Explore a gentle cleansing and hydration starting point.',
    products: ['moisturizing-gel-oily-skin', 'vitamin-c-face-wash']
  },
  {
    slug: 'dullness',
    title: 'Dullness',
    description: 'Start with an everyday cleanse and a consistent routine.',
    products: ['vitamin-c-face-wash']
  },
  {
    slug: 'sun-protection',
    title: 'Sun protection',
    description: 'Find an SPF step to complete your morning routine.',
    products: ['aqua-sunscreen-gel-spf-50-pa-3plus']
  },
  {
    slug: 'uneven-looking-tone',
    title: 'Uneven-looking tone',
    description: 'Explore targeted care and review the product details.',
    products: ['ocevia-brightening-cream']
  }
];

export function getProducts(slugs) {
  return slugs.map(slug => ({ slug, ...products[slug] })).filter(product => product.name);
}
