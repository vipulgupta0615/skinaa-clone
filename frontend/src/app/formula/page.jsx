import FormulaExperience from '../../components/FormulaExperience';
import StorePageShell from '../../components/StorePageShell';

export const metadata = { title: 'Explore the formula — SKINAA' };

export default function FormulaPage() {
  return (
    <StorePageShell hero={{
      eyebrow: 'A CLOSER LOOK / DAILY DEFENCE',
      title: <>Feel the science.<br /><em>Move through the formula.</em></>,
      description: 'Drag to rotate the 3D packaging concept, or use the keyboard-accessible controls to explore its formula story.',
      actionHref: '/products/aqua-sunscreen-gel-spf-50-pa-3plus',
      actionLabel: 'View Aqua SPF 50+ Gel'
    }}>
      <main className="store-page formula-page">
        <FormulaExperience />
        <section className="formula-page-note">
          <p className="eyebrow">THE REAL PRODUCT, CLEARLY</p>
          <p>This interactive packaging is a concept visualization, not a photorealistic product model. Check the product page and packaging for complete ingredient, direction and precaution details.</p>
          <a className="button dark" href="/products/aqua-sunscreen-gel-spf-50-pa-3plus">View Aqua SPF 50+ Gel →</a>
        </section>
      </main>
    </StorePageShell>
  );
}
