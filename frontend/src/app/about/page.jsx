import StorePageShell from '../../components/StorePageShell';

export const metadata = { title: 'Our approach — SKINAA' };

export default function AboutPage() {
  return (
    <StorePageShell hero={{
      eyebrow: 'SKINCARE, WITH A LITTLE MORE FEELING',
      title: <>Good science.<br /><em>Your kind of care.</em></>,
      description: 'We believe a skincare routine should feel clear, considered and personal—not like another thing to get perfect.',
      actionHref: '/products',
      actionLabel: 'Explore the products'
    }}>
      <main className="store-page about-page">
        <div className="about-principles">
          <article><span>01 / SIMPLICITY</span><h2>Start with what matters.</h2><p>Discover everyday steps for cleansing, hydration and sun protection, then build at your own pace.</p></article>
          <article><span>02 / TRANSPARENCY</span><h2>Choose with confidence.</h2><p>Explore product descriptions, key ingredients and routine pairings before making your choice.</p></article>
          <article><span>03 / YOUR SKIN</span><h2>Make room for real life.</h2><p>There is no one-size-fits-all routine. Find a starting point that suits the day you are having.</p></article>
        </div>
      </main>
    </StorePageShell>
  );
}
