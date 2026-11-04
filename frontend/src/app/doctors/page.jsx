import StorePageShell from '../../components/StorePageShell';

export const metadata = { title: 'Our doctors — SKINAA' };

export default function DoctorsPage() {
  return (
    <StorePageShell hero={{
      eyebrow: 'EXPERTISE, WITH A HUMAN TOUCH',
      title: <>Our doctors.<br /><em>Guiding everyday care.</em></>,
      description: 'Explore SKINAA’s dermatology-led approach, with thoughtful formulas and clear product information to help you make informed choices.',
      actionHref: '/concerns',
      actionLabel: 'Explore skin concerns'
    }}>
      <main className="store-page">
        <section className="doctor-feature">
          <div className="doctor-monogram" aria-hidden="true">✳</div>
          <div>
            <p className="eyebrow">OUR APPROACH</p>
            <h2>Science-led.<br /><em>Never one-size-fits-all.</em></h2>
            <p>Skin concerns can be personal and complex. Our product pages share ingredient and routine information to help you make an informed choice, while a qualified dermatologist can provide advice tailored to you.</p>
            <a className="button dark" href="/concerns">Explore skin concerns →</a>
          </div>
        </section>
        <section className="doctor-principles" aria-label="Our care principles">
          <article><span>01</span><h2>Start with the basics.</h2><p>Build a simple routine with products that fit your own needs and comfort.</p></article>
          <article><span>02</span><h2>Know what you use.</h2><p>Review product details, directions, ingredients and precautions before use.</p></article>
          <article><span>03</span><h2>Ask an expert.</h2><p>For persistent, changing or worrying skin concerns, seek care from a qualified dermatologist.</p></article>
        </section>
        <p className="shop-note">This site provides general product information and is not a substitute for individualized medical advice.</p>
      </main>
    </StorePageShell>
  );
}
