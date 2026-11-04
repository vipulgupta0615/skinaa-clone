import { notFound } from 'next/navigation';

import { products } from '../../../lib/products';
import { AddToCart } from '../../../components/Cart';

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
      <div className="product-page-grid"><div className="product-page-art">{product.image ? <img src={`/assets/${product.image}.webp`} alt={product.name} width="533" height="533" /> : <div className="product-placeholder"><span>✦</span><p>Targeted care.<br />Thoughtfully considered.</p></div>}</div><section><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-page-price">₹{product.price}</p><p className="body-copy">{product.description}</p><dl><div><dt>Formula focus</dt><dd>{product.ingredient}</dd></div><div><dt>Your routine step</dt><dd>{product.step}</dd></div></dl><p className="body-copy">{product.pairing}</p><AddToCart slugs={[slug]} /><a className="button outline" href="/#routine">Build my routine →</a><p className="shop-note">This is an assignment demo; purchases are not supported. You can explore products and save your routine on this device.</p><details><summary>Before you begin</summary><p>Check the product packaging for the complete ingredient list, directions and precautions. This page is a product overview.</p></details></section></div>
      <a className="button outline" href="/#journey">Explore by skin concern →</a>
    </main>
  </>;
}
