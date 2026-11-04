import { BagLink } from './Cart';
import StorePageHero from './StorePageHero';

export default function StorePageShell({ children, hero }) {
  return (
    <>
      <div className="announcement"><span>Free shipping over ₹799</span><i /><span>Dermatologist-developed care</span><i /><span>Made for real skin days</span></div>
      <header className="site-header store-page-header">
        <a className="brand" href="/" aria-label="SKINAA home"><span>✦</span>SKINAA</a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/products">Shop</a>
          <a href="/categories">Categories</a>
          <a href="/concerns">Skin concerns</a>
          <a href="/doctors">Our doctors</a>
          <a href="/routine">Build a routine</a>
        </nav>
        <details className="store-mobile-menu">
          <summary><span>Menu</span><i /><i /></summary>
          <nav aria-label="Mobile navigation">
            <a href="/products">Shop essentials</a>
            <a href="/categories">Categories</a>
            <a href="/concerns">Skin concerns</a>
            <a href="/doctors">Our doctors</a>
            <a href="/routine">Build a routine</a>
            <a href="/formula">The formula</a>
            <a href="/about">Our approach</a>
          </nav>
        </details>
        <div className="header-actions">
          <BagLink />
        </div>
      </header>
      {hero && <StorePageHero {...hero} />}
      {children}
      <footer className="site-footer">
        <div><a className="brand" href="/"><span>✦</span>SKINAA</a><p>Made for the skin you live in.</p></div>
        <div><small>SHOP</small><a href="/products">All products</a><a href="/categories">Shop by category</a></div>
        <div><small>CARE</small><a href="/doctors">Our doctors</a><a href="/concerns">Skin concerns</a><a href="/about">Our approach</a></div>
        <p>© 2026 SKINAA. Science-led care. Made for the skin you live in.</p>
      </footer>
    </>
  );
}
