import { notFound } from 'next/navigation';

const products = {
  'aqua-sunscreen-gel-spf-50-pa-3plus': { name: 'Aqua SPF 50+ Gel', category: 'Daily protection', price: 489, image: 'aqua', ingredient: 'Hyaluronic acid', description: 'Lightweight broad-spectrum protection with a hydrating gel texture.', step: 'Protect', pairing: 'Complete your morning routine with a dedicated sunscreen step.' },
  'vitamin-c-face-wash': { name: 'Vitamin C Face Wash', category: 'Fresh beginnings', price: 341, image: 'vitamin-c', ingredient: 'Vitamin C', description: 'An everyday cleanser for a fresh start to your skincare ritual.', step: 'Cleanse', pairing: 'Start your morning or evening routine with cleansing, then follow with moisturizer.' },
  'moisturizing-gel-oily-skin': { name: 'Niacinamide Gel Moisturizer', category: 'Everyday hydration', price: 338, image: 'niacinamide', ingredient: 'Niacinamide', description: 'A lightweight gel moisturizer for breathable hydration.', step: 'Moisturize', pairing: 'A moisturizing step for your morning or evening routine.' },
  'ocevia-brightening-cream': { name: 'Ocevia Brightening Cream', category: 'Targeted care', price: 476, ingredient: 'Brightening care', description: 'A targeted skincare step for uneven-looking tone.', step: 'Treat', pairing: 'Build a considered routine around your skin. Follow the product label for use.' }
};

export function generateStaticParams() { return Object.keys(products).map(slug => ({ slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: products[slug] ? `${products[slug].name} — SKINAA` : 'Product not found — SKINAA' };
}
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = products[slug];
  if (!product) notFound();
  return <>
    <header className="site-header"><a className="brand" href="/"><span>✦</span>SKINAA</a><a className="text-link" href="/#essentials">Back to essentials ←</a></header>
    <main className="product-page">
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/#essentials">Essentials</a> / {product.name}</nav>
      <div className="product-page-grid"><div className="product-page-art">{product.image ? <img src={`/assets/${product.image}.webp`} alt={product.name} width="533" height="533" /> : <div className="product-placeholder"><span>✦</span><p>Targeted care.<br />Thoughtfully considered.</p></div>}</div><section><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-page-price">₹{product.price}</p><p className="body-copy">{product.description}</p><dl><div><dt>Formula focus</dt><dd>{product.ingredient}</dd></div><div><dt>Your routine step</dt><dd>{product.step}</dd></div></dl><p className="body-copy">{product.pairing}</p><a className="button dark" href="/#routine">Build my routine →</a><p className="shop-note">Online checkout is not yet available. You can explore products and save your routine on this device.</p><details><summary>Before you begin</summary><p>Check the product packaging for the complete ingredient list, directions and precautions. This page is a product overview.</p></details></section></div>
      <a className="button outline" href="/#journey">Explore by skin concern →</a>
    </main>
  </>;
}
