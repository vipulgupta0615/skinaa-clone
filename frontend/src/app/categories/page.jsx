import StorePageShell from '../../components/StorePageShell';
import { categories, getProducts } from '../../lib/store-pages';

export const metadata = { title: 'Shop by category — SKINAA' };

export default function CategoriesPage() {
  return (
    <StorePageShell hero={{
      eyebrow: 'FIND YOUR KIND OF CARE',
      title: <>Good skin days,<br /><em>by category.</em></>,
      description: 'Choose the step you want to explore. Every category opens its own product edit.',
      actionHref: '/products',
      actionLabel: 'Shop all products'
    }}>
      <main className="store-page">
        <div className="store-category-grid">
          {Object.entries(categories).map(([slug, category], index) => {
            const featuredProduct = getProducts(category.products)[0];
            return (
              <a className="store-category-card" href={`/categories/${slug}`} key={slug}>
                <span className="eyebrow">0{index + 1} / SKINAA EDIT</span>
                <span className="store-category-image">{featuredProduct?.image ? <img src={`/assets/${featuredProduct.image}.webp`} alt="" width="500" height="500" /> : <span aria-hidden="true">✦</span>}</span>
                <strong>{category.title}</strong>
                <small>{category.description}</small>
                <b aria-hidden="true">Explore category ↗</b>
              </a>
            );
          })}
        </div>
      </main>
    </StorePageShell>
  );
}
