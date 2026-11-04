import StorePageShell from '../../components/StorePageShell';
import StoreRoutineBuilder from '../../components/StoreRoutineBuilder';

export const metadata = { title: 'Build your skincare routine — SKINAA' };

export default function RoutinePage() {
  return (
    <StorePageShell hero={{
      eyebrow: 'YOUR SKIN, YOUR STARTING POINT',
      title: <>A routine that<br /><em>fits your day.</em></>,
      description: 'Choose the steps you want to explore, save your selection on this device, and add your edit to the demo bag.',
      actionHref: '/products',
      actionLabel: 'Browse products'
    }}>
      <main className="store-page">
        <StoreRoutineBuilder />
      </main>
    </StorePageShell>
  );
}
