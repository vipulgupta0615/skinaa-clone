import Cart from '../../components/Cart';
import StorePageShell from '../../components/StorePageShell';
export const metadata = { title: 'Your bag — SKINAA' };
export default function CartPage(){return <StorePageShell hero={{
  eyebrow: 'YOUR EVERYDAY EDIT',
  title: <>Your bag.<br /><em>Ready when you are.</em></>,
  description: 'Review your selected SKINAA products. This demo bag is saved on this device; no payments or orders are processed.',
  actionHref: '/products',
  actionLabel: 'Continue shopping'
}}><Cart/></StorePageShell>;}
