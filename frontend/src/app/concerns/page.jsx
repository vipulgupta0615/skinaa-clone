import StorePageShell from '../../components/StorePageShell';
import { concernGuides, getProducts } from '../../lib/store-pages';

export const metadata = { title: 'Find care by concern — SKINAA' };

export default function ConcernsPage() {
  return (
    <StorePageShell hero={{
      eyebrow: 'A LITTLE LESS GUESSWORK',
      title: <>Where do you want<br /><em>your skin to go?</em></>,
      description: 'Explore a starting point for the skin days you’re having. These guides are for discovery, not diagnosis.',
      actionHref: '/routine',
      actionLabel: 'Build a routine'
    }}>
      <main className="store-page">
        <div className="concern-page-grid">
          {concernGuides.map((guide, index) => {
            const product = getProducts(guide.products)[0];
            return (
              <article className="concern-page-card" key={guide.slug}>
                <span className="eyebrow">0{index + 1} / SKIN JOURNEY</span>
                <h2>{guide.title}</h2>
                <p>{guide.description}</p>
                <a className="button outline" href={`/products/${product.slug}`}>Explore {product.name} ↗</a>
              </article>
            );
          })}
        </div>
      </main>
    </StorePageShell>
  );
}
