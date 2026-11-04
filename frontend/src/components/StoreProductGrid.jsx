import { AddToCart } from './Cart';

export default function StoreProductGrid({ products: items }) {
  return (
    <div className="store-product-grid">
      {items.map(product => (
        <article className={`store-product-card ${product.color || ''}`} key={product.slug}>
          <a className="store-product-image" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
            {product.image
              ? <img src={`/assets/${product.image}.webp`} alt={product.name} width="500" height="500" />
              : <span className="store-product-placeholder" aria-hidden="true">✦</span>}
            <span className="image-arrow">↗</span>
          </a>
          <div className="store-product-copy">
            <p className="eyebrow">{product.category}</p>
            <h2><a href={`/products/${product.slug}`}>{product.name}</a></h2>
            <p>{product.description}</p>
            <strong>₹{product.price.toLocaleString('en-IN')}</strong>
            <AddToCart slugs={[product.slug]} label="Add to bag +" />
          </div>
        </article>
      ))}
    </div>
  );
}
