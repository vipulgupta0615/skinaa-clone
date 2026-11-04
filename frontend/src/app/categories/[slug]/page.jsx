import { notFound } from 'next/navigation';
import StorePageShell from '../../../components/StorePageShell';
import StoreProductGrid from '../../../components/StoreProductGrid';
import { categories, getProducts } from '../../../lib/store-pages';

export function generateStaticParams() {
  return Object.keys(categories).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: categories[slug] ? `${categories[slug].title} — SKINAA` : 'Category not found — SKINAA' };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = categories[slug];
  if (!category) notFound();

  return (
    <StorePageShell hero={{
      eyebrow: `THE SKINAA EDIT / ${category.title.toUpperCase()}`,
      title: <>{category.title}<br /><em>for your ritual.</em></>,
      description: category.description,
      actionHref: '/categories',
      actionLabel: 'All categories'
    }}>
      <main className="store-page">
        <StoreProductGrid products={getProducts(category.products)} />
      </main>
    </StorePageShell>
  );
}
