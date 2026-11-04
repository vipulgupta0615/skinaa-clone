import StorePageShell from '../../components/StorePageShell';
import StoreProductGrid from '../../components/StoreProductGrid';
import { getProducts } from '../../lib/store-pages';
import { products } from '../../lib/products';

export const metadata = { title: 'Shop all skincare — SKINAA' };

export default function ProductsPage() {
  return (
    <StorePageShell hero={{
      eyebrow: 'THE EVERYDAY EDIT / ALL PRODUCTS',
      title: <>Small steps.<br /><em>Skin-changing rituals.</em></>,
      description: 'Explore the SKINAA edit, find your next step, and add products to your on-site demo bag.',
      actionHref: '/categories',
      actionLabel: 'Explore categories'
    }}>
      <main className="store-page">
        <StoreProductGrid products={getProducts(Object.keys(products))} />
      </main>
    </StorePageShell>
  );
}
